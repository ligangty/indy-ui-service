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
package org.commonjava.indy.service.jaxrs.pathmap;

import org.commonjava.indy.service.client.pathmap.PathMappedServiceClient;
import org.commonjava.indy.service.models.pathmap.PathMappedDeleteResult;
import org.commonjava.indy.service.models.pathmap.PathMappedListResult;
import org.commonjava.indy.service.models.repository.StoreType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import javax.inject.Inject;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.commonjava.indy.service.client.pathmap.PathMappedServiceClient.BROWSE_BASE;
import static org.commonjava.indy.service.client.pathmap.PathMappedServiceClient.CONCRETE_CONTENT_PATH;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( name = "Path-mapped storage maintenance operation", description = "Repair path-mapped storage problems." )
@Path( "/api/admin/pathmapped" )
public class PathMappedResource
{
    @Inject
    @RestClient
    PathMappedServiceClient client;

    @Operation( description = "List root." )
    @Parameters( { @Parameter( name = "packageType", in = PATH, required = true ), @Parameter( name = "type", in = PATH,
                                                                                               content = @Content(
                                                                                                       schema = @Schema(
                                                                                                               implementation = StoreType.class ) ),
                                                                                               required = true ),
            @Parameter( name = "name", in = PATH,
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", description = "Operation finished.",
                  content = @Content( schema = @Schema( implementation = PathMappedListResult.class ) ) )
    @GET
    @Path( BROWSE_BASE )
    @Produces( APPLICATION_JSON )
    public PathMappedListResult listRoot( final @PathParam( "packageType" ) String packageType,
                                          final @PathParam( "type" ) String type,
                                          final @PathParam( "name" ) String name,
                                          final @QueryParam( "recursive" ) boolean recursive,
                                          final @QueryParam( "type" ) String fileType,
                                          final @QueryParam( "limit" ) int limit,
                                          final @Context HttpServletRequest request,
                                          final @Context SecurityContext securityContext )
    {
        return client.listRoot( packageType, type, name, recursive, fileType, limit, request, securityContext );
    }

    @Operation( description = "List specified path." )
    @Parameters( { @Parameter( name = "packageType", in = PATH, required = true ), @Parameter( name = "type", in = PATH,
                                                                                               content = @Content(
                                                                                                       schema = @Schema(
                                                                                                               implementation = StoreType.class ) ),
                                                                                               required = true ),
            @Parameter( name = "name", in = PATH,
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", description = "Operation finished.",
                  content = @Content( schema = @Schema( implementation = PathMappedListResult.class ) ) )
    @GET
    @Path( BROWSE_BASE + "/{path: (.*)}" )
    @Produces( APPLICATION_JSON )
    public PathMappedListResult list( final @PathParam( "packageType" ) String packageType,
                                      final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                      final @PathParam( "path" ) String path,
                                      final @QueryParam( "recursive" ) boolean recursive,
                                      final @QueryParam( "type" ) String fileType,
                                      final @QueryParam( "limit" ) int limit, final @Context HttpServletRequest request,
                                      final @Context SecurityContext securityContext )
    {
        return client.list( packageType, type, name, path, recursive, fileType, limit, request, securityContext );
    }

    @Operation( description = "Get specified path." )
    @Parameters( { @Parameter( name = "packageType", in = PATH, required = true ), @Parameter( name = "type", in = PATH,
                                                                                               content = @Content(
                                                                                                       schema = @Schema(
                                                                                                               implementation = StoreType.class ) ),
                                                                                               required = true ),
            @Parameter( name = "name", in = PATH,
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", description = "Operation finished." )
    @GET
    @Path( CONCRETE_CONTENT_PATH )
    public Response get( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                         final @PathParam( "name" ) String name, final @PathParam( "path" ) String path,
                         final @Context HttpServletRequest request, final @Context SecurityContext securityContext )
    {
        return client.get( packageType, type, name, path, request, securityContext );
    }

    @Operation( description = "Delete specified path." )
    @Parameters( { @Parameter( name = "packageType", in = PATH, required = true ), @Parameter( name = "type", in = PATH,
                                                                                               content = @Content(
                                                                                                       schema = @Schema(
                                                                                                               implementation = StoreType.class ) ),
                                                                                               required = true ),
            @Parameter( name = "name", in = PATH,
                        content = @Content( schema = @Schema( implementation = String.class ) ), required = true ) } )
    @APIResponse( responseCode = "200", description = "Operation finished.",
                  content = @Content( schema = @Schema( implementation = PathMappedDeleteResult.class ) ) )
    @DELETE
    @Path( CONCRETE_CONTENT_PATH )
    @Produces( APPLICATION_JSON )
    public PathMappedDeleteResult delete( final @PathParam( "packageType" ) String packageType,
                                          final @PathParam( "type" ) String type,
                                          final @PathParam( "name" ) String name,
                                          final @PathParam( "path" ) String path,
                                          final @Context HttpServletRequest request,
                                          final @Context SecurityContext securityContext )
    {
        return client.delete( packageType, type, name, path, request, securityContext );
    }
}
