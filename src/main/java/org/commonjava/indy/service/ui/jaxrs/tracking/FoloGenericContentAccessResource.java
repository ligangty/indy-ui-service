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
package org.commonjava.indy.service.ui.jaxrs.tracking;

import org.commonjava.indy.service.ui.client.tracking.FoloGenericContentAccessServiceClient;
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

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
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

import static org.commonjava.indy.service.ui.client.Constants.CHECK_CACHE_ONLY;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( description = "FOLO Tracked Content Access and Storage. Tracks retrieval and management of file/artifact content." )
@Path( "/api/folo/track/{id}/generic-http/{type: (hosted|group|remote)}/{name}" )
public class FoloGenericContentAccessResource
{
    @Inject
    @RestClient
    FoloGenericContentAccessServiceClient client;

    @Operation(
            description = "Store and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )
    @PUT
    @Path( "/{path: (.*)}" )
    public Response doCreate( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                              @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                              @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doCreate( id, type, name, path, request, uriInfo );
    }

    @Operation(
            description = "Store and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200", description = "Header metadata for content" ), } )
    @HEAD
    @Path( "/{path: (.*)}" )
    public Response doHead( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                            @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                            @QueryParam( CHECK_CACHE_ONLY ) final Boolean cacheOnly,
                            @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doHead( id, type, name, path, cacheOnly, request, uriInfo );
    }

    @Operation(
            description = "Retrieve and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = @Content( schema = @Schema( implementation = StreamingOutput.class ) ),
                          description = "Content stream" ), } )
    @GET
    @Path( "/{path: (.*)}" )
    public Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                           @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                           @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doGet( id, type, name, path, request, uriInfo );
    }

    @Operation(
            description = "Retrieve and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = @Content( schema = @Schema( implementation = StreamingOutput.class ) ),
                          description = "Content stream" ), } )
    @GET
    @Path( "/" )
    public Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                           @PathParam( "name" ) final String name, @Context final HttpServletRequest request,
                           @Context final UriInfo uriInfo )
    {
        return client.doGet( id, type, name, request, uriInfo );
    }

}
