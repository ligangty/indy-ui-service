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

import org.commonjava.indy.service.ui.client.tracking.FoloNPMContentAccessServiceClient;
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

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HEAD;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;
import jakarta.ws.rs.core.UriInfo;

import static org.commonjava.indy.service.ui.client.Constants.CHECK_CACHE_ONLY;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( description = "FOLO Tracked Content Access and Storage For NPM related artifacts. Tracks retrieval and management of file/artifact content." )
@Path( "/api/folo/track/{id}/npm/{type: (hosted|group|remote)}/{name}" )
public class FoloNPMContentAccessResource
{
    @Inject
    @RestClient
    FoloNPMContentAccessServiceClient client;

    @Operation(
            description = "Store and track NPM file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )
    @PUT
    @Path( "/{packageName}" )
    public Response doCreate( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                              @PathParam( "name" ) final String name,
                              @PathParam( "packageName" ) final String packageName,
                              @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doCreate( id, type, name, packageName, request, uriInfo );
    }

    @Operation(
            description = "Store NPM artifact content under the given artifact store (type/name), packageName and versionTarball (/version or /-/tarball)." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true ),
            @Parameter( name = "name", in = PATH, required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )
    @PUT
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doCreate( @PathParam( "id" ) final String id, final @PathParam( "type" ) String type,
                              final @PathParam( "name" ) String name,
                              final @PathParam( "packageName" ) String packageName,
                              final @PathParam( "versionTarball" ) String versionTarball,
                              final @Context UriInfo uriInfo, final @Context HttpServletRequest request )
    {
        return client.doCreate( id, type, name, packageName, versionTarball, uriInfo, request );
    }

    @Operation(
            description = "Store and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true ),
            @Parameter( name = "name", in = PATH, required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          description = "Header metadata for content (or rendered listing when path ends with '/index.html' or '/'" ), } )
    @HEAD
    @Path( "/{packageName}" )
    public Response doHead( @PathParam( "id" ) final String id, final @PathParam( "type" ) String type,
                            final @PathParam( "name" ) String name,
                            final @PathParam( "packageName" ) String packageName,
                            final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly, final @Context UriInfo uriInfo,
                            final @Context HttpServletRequest request )
    {
        return client.doHead( id, type, name, packageName, cacheOnly, uriInfo, request );
    }

    @Operation(
            description = "Store and track file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          description = "Header metadata for content (or rendered listing when path ends with '/index.html' or '/'" ), } )
    @HEAD
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doHead( final @PathParam( "id" ) String id, final @PathParam( "type" ) String type,
                            final @PathParam( "name" ) String name,
                            final @PathParam( "packageName" ) String packageName,
                            final @PathParam( "versionTarball" ) String versionTarball,
                            final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly,
                            @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doHead( id, type, name, packageName, versionTarball, cacheOnly, request, uriInfo );
    }

    @Operation(
            description = "Retrieve and track NPM file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = { @Content( schema = @Schema( implementation = String.class ) ),
                                  @Content( schema = @Schema( implementation = StreamingOutput.class ) ) },
                          description = "Rendered content listing (when path ends with '/index.html' or '/') or Content streaming for concrete files." ) } )
    @GET
    @Path( "/{packageName}" )
    public Response doGet( final @PathParam( "id" ) String id, final @PathParam( "type" ) String type,
                           final @PathParam( "name" ) String name, final @PathParam( "packageName" ) String packageName,
                           @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doGet( id, type, name, packageName, request, uriInfo );
    }

    @Operation(
            description = "Retrieve and track NPM file/artifact content under the given artifact store (type/name) and path." )
    @Parameters( { @Parameter( name = "id", description = "User-assigned tracking session key", in = PATH ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                        required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = { @Content( schema = @Schema( implementation = String.class ) ),
                                  @Content( schema = @Schema( implementation = StreamingOutput.class ) ) },
                          description = "Rendered content listing (when path ends with '/index.html' or '/') or Content streaming for concrete files." ) } )
    @GET
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doGet( final @PathParam( "id" ) String id, final @PathParam( "type" ) String type,
                           final @PathParam( "name" ) String name, final @PathParam( "packageName" ) String packageName,
                           final @PathParam( "versionTarball" ) String versionTarball,
                           @Context final HttpServletRequest request, @Context final UriInfo uriInfo )
    {
        return client.doGet( id, type, name, packageName, versionTarball, request, uriInfo );
    }

}
