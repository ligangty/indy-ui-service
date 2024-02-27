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
package org.commonjava.indy.service.ui.client.content;

import org.commonjava.indy.service.ui.models.content.ContentBrowseResult;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.HttpHeaders;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.util.stream.Collectors;

import static org.apache.commons.lang3.StringUtils.isNotBlank;
import static org.commonjava.indy.service.ui.util.UrlUtils.replaceHostInUrl;

@ApplicationScoped
public class ContentBrowseReGenClient
{
    private final Logger logger = LoggerFactory.getLogger( this.getClass() );

    @Inject
    @RestClient
    ContentBrowseServiceClient client;

    public Response headForDirectory( final String packageType, String type, final String name, String path )
    {
        return client.headForDirectory( packageType, type, name, path );
    }

    public Response browseDirectory( final String packageType, String type, final String name, String path,
                                     final UriInfo uriInfo )
    {
        try (Response r = client.browseDirectory( packageType, type, name, path, uriInfo ))
        {
            return doResponse( r, uriInfo );
        }
    }

    public Response browseRoot( final String packageType, String type, final String name, final UriInfo uriInfo )
    {
        try (Response r = client.browseRoot( packageType, type, name, uriInfo ))
        {
            return doResponse( r, uriInfo );
        }
    }

    public Response doResponse( final Response original, final UriInfo uriInfo )
    {
        if ( original.getStatus() == Response.Status.OK.getStatusCode() )
        {
            ContentBrowseResult result = original.readEntity( ContentBrowseResult.class );
            final String localHost = uriInfo.getBaseUri().getHost();
            final int localPort = uriInfo.getBaseUri().getPort();
            final String newHost = localPort > 0 && localPort != 80 && localPort != 443 ?
                    String.format( "%s:%s", localHost, localPort ) :
                    localHost;
            logger.debug( "Base Host:{}", newHost );
            if ( isNotBlank( result.getParentUrl() ) )
            {
                result.setParentUrl( replaceHostInUrl( result.getParentUrl(), newHost ) );
            }
            if ( isNotBlank( result.getBaseBrowseUrl() ) )
            {
                result.setBaseBrowseUrl( replaceHostInUrl( result.getBaseBrowseUrl(), newHost ) );
            }
            if ( isNotBlank( result.getBaseContentUrl() ) )
            {
                result.setBaseContentUrl( replaceHostInUrl( result.getBaseContentUrl(), newHost ) );
            }
            if ( isNotBlank( result.getStoreBrowseUrl() ) )
            {
                result.setStoreBrowseUrl( replaceHostInUrl( result.getStoreBrowseUrl(), newHost ) );
            }
            if ( isNotBlank( result.getStoreContentUrl() ) )
            {
                result.setStoreContentUrl( replaceHostInUrl( result.getStoreContentUrl(), newHost ) );
            }
            if ( result.getSources() != null && !result.getSources().isEmpty() )
            {
                result.setSources( result.getSources()
                                         .stream()
                                         .map( s -> replaceHostInUrl( s, newHost ) )
                                         .collect( Collectors.toList() ) );
            }
            if ( result.getListingUrls() != null && !result.getListingUrls().isEmpty() )
            {
                for ( ContentBrowseResult.ListingURLResult listResult : result.getListingUrls() )
                {
                    listResult.setListingUrl( replaceHostInUrl( listResult.getListingUrl(), newHost ) );
                }
            }
            Response.ResponseBuilder newRes = Response.ok( result );
            original.getStringHeaders().forEach( ( k, v ) -> {
                // Seems the new generated json length is not equal to original, so ignore the original header.
                if ( !HttpHeaders.CONTENT_LENGTH.equalsIgnoreCase( k ) )
                {
                    String value = v.stream().findFirst().orElse( "" );
                    logger.debug( "Original http headers: {} -> {}", k, value );
                    newRes.header( k, value );
                }
            } );
            return newRes.build();
        }
        else
        {
            return original;
        }
    }

}
