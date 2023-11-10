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
package org.commonjava.indy.service.ui.jaxrs.content;

import io.quarkus.vertx.http.Uncompressed;
import org.apache.commons.io.IOUtils;
import org.commonjava.indy.service.ui.client.content.MavenContentAccessServiceClient;
import org.commonjava.indy.service.ui.models.repository.StoreType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import javax.ws.rs.core.UriInfo;
import java.io.InputStream;

import static org.commonjava.indy.service.ui.client.Constants.CHECK_CACHE_ONLY;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.QUERY;

@Tag( name = "Maven Content Access and Storage",
      description = "Handles retrieval and management of Maven artifact content. This is the main point of access for Maven/Gradle users." )
@Path( "/api/content/maven/{type: (hosted|group|remote)}/{name}" )
public class MavenContentAccessResource
{
    private final Logger logger = LoggerFactory.getLogger( this.getClass() );

    @Inject
    @RestClient
    MavenContentAccessServiceClient client;

    @Operation( description = "Store Maven artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )

    @PUT
    @Path( "/{path: (.+)?}" )
    public Response doCreate( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "path" ) String path, final @Context UriInfo uriInfo,
                              final @Context HttpServletRequest request )
    {
        return client.doCreate( type, name, path, uriInfo, request );
    }

    @Operation( description = "Delete Maven artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = CHECK_CACHE_ONLY, in = QUERY,
                        content = @Content( schema = @Schema( implementation = Boolean.class ) ) ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "204", description = "Content was deleted successfully" ) } )
    @DELETE
    @Path( "/{path: (.*)}" )
    public Response doDelete( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "path" ) String path,
                              final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly )
    {
        return client.doDelete( type, name, path, cacheOnly );
    }

    @Operation( description = "Store Maven artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = CHECK_CACHE_ONLY, in = QUERY,
                        content = @Content( schema = @Schema( implementation = Boolean.class ) ) ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          description = "Header metadata for content (or rendered listing when path ends with '/index.html' or '/'" ) } )
    @HEAD
    @Path( "/{path: (.*)}" )
    @Uncompressed // We should never compress this because it is often used by cli tools or other non-browser tools
    public Response doHead( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                            final @PathParam( "path" ) String path,
                            final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly, final @Context UriInfo uriInfo,
                            final @Context HttpServletRequest request )
    {
        return client.doHead( type, name, path, cacheOnly, uriInfo, request );
    }

    @Operation( description = "Retrieve Maven artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = { @Content( schema = @Schema( implementation = String.class ) ),
                                  @Content( schema = @Schema( implementation = StreamingOutput.class ) ) },
                          description = "Rendered content listing (when path ends with '/index.html' or '/') or Content stream" ) } )
    @GET
    @Path( "/{path: (.*)}" )
    @Uncompressed // We should never compress this because it is often used by cli tools or other non-browser tools
    public Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                           final @PathParam( "path" ) String path, @Context final UriInfo uriInfo,
                           @Context final HttpServletRequest request )
    {
        if ( uriInfo.getAbsolutePath().toString().trim().endsWith( "/" ) )
        {
            return Response.seeOther(
                                   uriInfo.getBaseUriBuilder().path( "browse/maven" ).path( type ).path( name ).path( path ).build() )
                           .build();
        }
        // When direct send back the origin Response from client, not sure why it will cause encoding issue which will
        // send back the malformed content. So here we re-wrapped the original response content from client to a streamed
        // content.
        final Response response = client.doGet( type, name, path, uriInfo, request );
        final InputStream clientIn = response.readEntity( InputStream.class );
        StreamingOutput out = output -> IOUtils.copy( clientIn, output );
        return Response.status( response.getStatus() ).entity( out ).replaceAll( response.getHeaders() ).build();
    }

    @Operation( description = "Retrieve root listing under the given artifact store (type/name)." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "200",
                                   content = @Content( schema = @Schema( implementation = String.class ) ),
                                   description = "Rendered root content listing" ), @APIResponse( responseCode = "200",
                                                                                                  content = @Content(
                                                                                                          schema = @Schema(
                                                                                                                  implementation = StreamingOutput.class ) ),
                                                                                                  description = "Content stream" ) } )
    @GET
    @Path( "/" )
    public Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                           @Context final UriInfo uriInfo, @Context final HttpServletRequest request )
    {
        return Response.seeOther( uriInfo.getBaseUriBuilder().path( "browse/maven" ).path( type ).path( name ).build() )
                       .build();
    }

}
