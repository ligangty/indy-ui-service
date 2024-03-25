/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.commonjava.indy.service.ui.web;

import io.quarkus.runtime.LaunchMode;
import org.apache.commons.io.IOUtils;
import org.apache.http.HttpHeaders;
import org.commonjava.indy.service.ui.conf.ContentBrowseConfig;
import org.commonjava.indy.service.ui.util.MimeTyper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.spi.CDI;
import jakarta.inject.Inject;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.ws.rs.core.MediaType;
import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.Path;
import java.nio.file.Paths;

import static jakarta.servlet.http.HttpServletResponse.SC_BAD_REQUEST;
import static jakarta.servlet.http.HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
import static jakarta.servlet.http.HttpServletResponse.SC_METHOD_NOT_ALLOWED;
import static jakarta.servlet.http.HttpServletResponse.SC_NOT_FOUND;
import static jakarta.servlet.http.HttpServletResponse.SC_OK;

@ApplicationScoped
@WebServlet( urlPatterns = { ContentBrowseUIServlet.PATH } )
public class ContentBrowseUIServlet
        extends HttpServlet
{

    private static final long serialVersionUID = 1L;

    private final Logger logger = LoggerFactory.getLogger( getClass() );

    public static final String PATH = "/browse/*";

    @Inject
    ContentBrowseConfig config;

    @Inject
    MimeTyper mimeTyper;

    private void sendFile( final HttpServletResponse response, final URL url, final String method )
    {
        logger.debug( "Checking for existence of: '{}'", url );
        if ( url != null )
        {
            if ( "GET".equals( method ) )
            {
                logger.debug( "sending file" );
                response.setStatus( SC_OK );
                response.addHeader( HttpHeaders.CONTENT_TYPE, getContentType( url.getFile() ) );

                InputStream inputStream = null;
                OutputStream outputStream;
                try
                {
                    inputStream = url.openStream();
                    outputStream = response.getOutputStream();

                    IOUtils.copy( inputStream, outputStream );
                    outputStream.flush();
                }
                catch ( final IOException e )
                {
                    logger.error( String.format( "Failed to transfer requested resource: %s. Reason: %s", url,
                                                 e.getMessage() ), e );
                    try
                    {
                        response.sendError( SC_INTERNAL_SERVER_ERROR, "Failed to write response" );
                    }
                    catch ( final IOException eResp )
                    {
                        logger.warn( "Failed to send error response to client: " + eResp.getMessage(), eResp );
                    }
                }
                finally
                {
                    IOUtils.closeQuietly( inputStream );
                }
            }
            else
            {
                response.setStatus( SC_METHOD_NOT_ALLOWED );
            }
        }
        else
        {
            response.setStatus( SC_NOT_FOUND );
        }
    }

    private String getContentType( String resource )
    {
        if ( resource.endsWith( ".html" ) )
        {
            return MediaType.TEXT_HTML;
        }
        else if ( resource.endsWith( ".css" ) )
        {
            return "text/css";
        }
        else if ( resource.endsWith( ".js" ) )
        {
            return "application/javascript";
        }

        return mimeTyper.getContentType( resource );
    }

    @Override
    protected void service( final HttpServletRequest request, final HttpServletResponse response )
            throws ServletException, IOException
    {
        if ( config == null )
        {
            config = CDI.current().select( ContentBrowseConfig.class ).get();
        }

        String path;
        try
        {
            path = new URI( request.getRequestURI() ).getPath();
        }
        catch ( final URISyntaxException e )
        {
            logger.error( "Cannot parse request URI", e );
            response.setStatus( 400 );
            return;
        }

        final String method = request.getMethod().toUpperCase();

        logger.info( "{} {}", method, path );

        path = path.replace( "browse/", "" );

        switch ( method )
        {
            case "GET":
            case "HEAD":
            {
                if ( path.startsWith( "/" ) )
                {
                    logger.debug( "Trimming leading '/' from path" );
                    path = path.substring( 1 );
                }

                if ( !path.equals( "app_bundle.js" ) )
                {
                    logger.debug( "All path which is not requesting .js will rewrite to index.html" );
                    path = "index.html";
                }

                try
                {
                    logger.debug( "Launch mode: {}", LaunchMode.current() );
                    final URL url;
                    if ( LaunchMode.current() == LaunchMode.DEVELOPMENT )
                    {
                        url = resourceForDevMode( path );
                    }
                    else
                    {
                        url = resourceForProdMode( path );
                    }
                    logger.debug( "processing and returning: {}", url );
                    sendFile( response, url, method );
                    return;
                }
                catch ( URISyntaxException | MalformedURLException e )
                {
                    throw new ServletException( e );
                }
            }
            default:
            {
                logger.error( "cannot handle request for method: {}", method );
                response.setStatus( SC_BAD_REQUEST );
            }
        }
    }

    private URL resourceForDevMode( final String path )
            throws URISyntaxException, MalformedURLException
    {
        Path samplePath = Paths.get( Thread.currentThread().getContextClassLoader().getResource( "META-INF" ).toURI() );
        FilenameFilter filter = ( dir, name ) -> {
            logger.debug( "{} : {}", dir, name );
            return new File( dir, name ).isDirectory();
        };
        File webui = new File( samplePath.getParent().getParent().toFile(), "quinoa-build/content-browse" );
        webui.list( filter );
        return new File( webui, path ).toURI().toURL();
    }

    private URL resourceForProdMode( final String path )
    {
        final String fPath = config.resourceRoot() + path;
        logger.debug( "requesting {}", fPath );
        URL url = Thread.currentThread().getContextClassLoader().getResource( fPath );
        logger.debug( "The resource path: {}", url );
        return url;
    }

}
