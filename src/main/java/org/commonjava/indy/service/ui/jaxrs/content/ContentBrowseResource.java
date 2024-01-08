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

import org.commonjava.indy.service.ui.client.content.ContentBrowseReGenClient;
import org.commonjava.indy.service.ui.models.repository.StoreType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HEAD;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( name = "Indy Directory Content Browse", description = "Browse directory content in indy repository" )
@Path( "/api/browse/{packageType}/{type: (hosted|group|remote)}/{name}" )
public class ContentBrowseResource
{
    @Inject
    ContentBrowseReGenClient client;

    @Operation(
            description = "Retrieve directory content under the given artifact store (type/name) and directory path." )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http", required = true ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "200",
                                   content = @Content( schema = @Schema( implementation = String.class ) ),
                                   description = "Rendered content listing" ),
            @APIResponse( responseCode = "404", description = "Content is not available" ) } )
    @HEAD
    @Path( "/{path (.*)}" )
    public Response headForDirectory( final @PathParam( "packageType" ) String packageType,
                                      final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                      final @PathParam( "path" ) String path )
    {
        return client.headForDirectory( packageType, type, name, path );
    }

    @Operation(
            description = "Retrieve directory content under the given artifact store (type/name) and directory path." )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http", required = true ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponses( { @APIResponse( responseCode = "200",
                                   content = @Content( schema = @Schema( implementation = String.class ) ),
                                   description = "Rendered content listing" ),
            @APIResponse( responseCode = "404", description = "Content is not available" ) } )
    @GET
    @Path( "/{path: (.*)}" )
    @Produces( APPLICATION_JSON )
    public Response browseDirectory( final @PathParam( "packageType" ) String packageType,
                                     final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                     final @PathParam( "path" ) String path, @Context final UriInfo uriInfo )
    {
        return client.browseDirectory( packageType, type, name, path, uriInfo );
    }

    @Operation( description = "Retrieve root listing under the given artifact store (type/name)." )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http", required = true ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true ),
            @Parameter( name = "name", in = PATH, description = "The name of the repository.",
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = String.class ) ),
                  description = "Rendered root content listing" )
    @GET
    @Path( "/" )
    @Produces( APPLICATION_JSON )
    public Response browseRoot( final @PathParam( "packageType" ) String packageType,
                                final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                @Context final UriInfo uriInfo )
    {
        return client.browseRoot( packageType, type, name, uriInfo );
    }

}
