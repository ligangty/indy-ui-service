/**
 * Copyright (C) 2011-2022 Red Hat, Inc. (https://github.com/Commonjava/indy)
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
package org.commonjava.indy.service.jaxrs.content;

import org.commonjava.indy.service.client.content.NPMContentAccessServiceClient;
import org.commonjava.indy.service.models.repository.StoreType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import javax.enterprise.context.ApplicationScoped;
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
import java.nio.file.Paths;

import static org.commonjava.indy.service.client.Constants.CHECK_CACHE_ONLY;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( name = "NPM Content Access and Storage",
      description = "Handles retrieval and management of NPM artifact content. This is the main point of access for NPM users." )
@Path( "/api/content/npm/{type: (hosted|group|remote)}/{name}" )
@ApplicationScoped
public class NPMContentAccessResource
{

    @Inject
    @RestClient
    NPMContentAccessServiceClient client;

    @Operation( description = "Store NPM artifact content under the given artifact store (type/name) and packageName." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )
    @PUT
    @Path( "/{packageName}" )
    public Response doCreate( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "packageName" ) String packageName, final @Context UriInfo uriInfo,
                              final @Context HttpServletRequest request )
    {
        return client.doCreate( type, name, packageName, uriInfo, request );
    }

    @Operation(
            description = "Store NPM artifact content under the given artifact store (type/name), packageName and versionTarball (/version or /-/tarball)." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "201", description = "Content was stored successfully" ),
            @APIResponse( responseCode = "400",
                          description = "No appropriate storage location was found in the specified store (this store, or a member if a group is specified)." ) } )
    @PUT
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doCreate( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "packageName" ) String packageName,
                              final @PathParam( "versionTarball" ) String versionTarball,
                              final @Context UriInfo uriInfo, final @Context HttpServletRequest request )
    {
        return client.doCreate( type, name, packageName, versionTarball, uriInfo, request );
    }

    @Operation(
            description = "Delete NPM package and metadata content under the given artifact store (type/name) and packageName." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "204", description = "Content was deleted successfully" ) } )
    @DELETE
    @Path( "/{path: (.*)}" )
    public Response doDelete( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                              final @PathParam( "path" ) String path, final @Parameter( name = CHECK_CACHE_ONLY,
                                                                                        content = @Content(
                                                                                                schema = @Schema(
                                                                                                        implementation = Boolean.class ) ) )
                              @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly )
    {
        return client.doDelete( type, name, path, cacheOnly );
    }

    @Operation(
            description = "Retrieve NPM package header metadata content under the given artifact store (type/name) and packageName." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Metadata Content is not available" ),
            @APIResponse( responseCode = "200", description = "Header metadata for package metadata content" ), } )
    @HEAD
    @Path( "/{packageName}" )
    public Response doHead( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                            final @PathParam( "packageName" ) String packageName,
                            final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly, @Context final UriInfo uriInfo,
                            @Context final HttpServletRequest request )
    {
        return client.doHead( type, name, packageName, cacheOnly, uriInfo, request );
    }

    @Operation(
            description = "Retrieve NPM package tarball header metadata content under the given artifact store (type/name), packageName and versionTarball (/version or /-/tarball)." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200", description = "Header metadata for tarball content" ), } )
    @HEAD
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doHead( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                            final @PathParam( "packageName" ) String packageName,
                            final @PathParam( "versionTarball" ) String versionTarball,
                            @QueryParam( CHECK_CACHE_ONLY ) final Boolean cacheOnly, @Context final UriInfo uriInfo,
                            @Context final HttpServletRequest request )
    {
        return client.doHead( type, name, packageName, versionTarball, cacheOnly, uriInfo, request );
    }

    @Operation(
            description = "Retrieve NPM package metadata content under the given artifact store (type/name) and packageName." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Metadata content is not available" ),
            @APIResponse( responseCode = "200",
                          content = { @Content( schema = @Schema( implementation = String.class ) ),
                                  @Content( schema = @Schema( implementation = StreamingOutput.class ) ) },
                          description = "Rendered content listing or Content stream" ) } )
    @GET
    @Path( "/{packageName}" )
    public Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                           final @PathParam( "packageName" ) String packageName, @Context final UriInfo uriInfo,
                           @Context final HttpServletRequest request )
    {
        return client.doGet( type, name, packageName, uriInfo, request );
    }

    @Operation(
            description = "Retrieve NPM package tarball content under the given artifact store (type/name), packageName and versionTarball (/version or /-/tarball)." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ),
            @Parameter( name = "packageName", in = PATH, description = "The npm package name.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "404", description = "Content is not available" ),
            @APIResponse( responseCode = "200",
                          content = @Content( schema = @Schema( implementation = StreamingOutput.class ) ),
                          description = "Content stream" ), } )
    @GET
    @Path( "/{packageName}/{versionTarball: (.*)}" )
    public Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                           final @PathParam( "packageName" ) String packageName,
                           final @PathParam( "versionTarball" ) String versionTarball, @Context final UriInfo uriInfo,
                           @Context final HttpServletRequest request )
    {
        return client.doGet( type, name, packageName, versionTarball, uriInfo, request );
    }

    @Operation( description = "Retrieve root listing under the given artifact store (type/name)." )
    @Parameters( { @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                               content = @Content( schema = @Schema( implementation = StoreType.class ) ),
                               required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", content = { @Content( schema = @Schema( implementation = String.class ) ),
            @Content( schema = @Schema( implementation = StreamingOutput.class ) ) },
                  description = "Rendered content listing or Content stream" )
    @GET
    @Path( "/" )
    public Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                           @Context final UriInfo uriInfo, @Context final HttpServletRequest request )
    {
        return client.doGet( type, name, uriInfo, request );
    }

}
