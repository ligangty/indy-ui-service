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
package org.commonjava.indy.service.ui.client.pathmap;

import org.commonjava.indy.service.ui.models.pathmap.PathMappedDeleteResult;
import org.commonjava.indy.service.ui.models.pathmap.PathMappedListResult;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

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

@Path( "/api/admin/pathmapped" )
@RegisterRestClient( configKey = "service-api" )
//@RegisterProvider( CustomClientRequestFilter.class)
public interface PathMappedServiceClient
{
    String BROWSE_BASE = "/browse/{packageType}/{type: (hosted|group|remote)}/{name}";

    String CONCRETE_CONTENT_PATH = "/content/{packageType}/{type: (hosted|group|remote)}/{name}/{path}";

    @GET
    @Path( BROWSE_BASE )
    @Produces( APPLICATION_JSON )
    PathMappedListResult listRoot( final @PathParam( "packageType" ) String packageType,
                                   final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                   final @QueryParam( "recursive" ) boolean recursive,
                                   final @QueryParam( "type" ) String fileType, final @QueryParam( "limit" ) int limit,
                                   final @Context HttpServletRequest request,
                                   final @Context SecurityContext securityContext );

    @GET
    @Path( BROWSE_BASE + "/{path}" )
    @Produces( APPLICATION_JSON )
    PathMappedListResult list( final @PathParam( "packageType" ) String packageType,
                               final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                               final @PathParam( "path" ) String path,
                               final @QueryParam( "recursive" ) boolean recursive,
                               final @QueryParam( "type" ) String fileType, final @QueryParam( "limit" ) int limit,
                               final @Context HttpServletRequest request,
                               final @Context SecurityContext securityContext );

    @GET
    @Path( CONCRETE_CONTENT_PATH )
    Response get( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                  final @PathParam( "name" ) String name, final @PathParam( "path" ) String path,
                  final @Context HttpServletRequest request, final @Context SecurityContext securityContext );

    @DELETE
    @Path( CONCRETE_CONTENT_PATH )
    @Produces( APPLICATION_JSON )
    PathMappedDeleteResult delete( final @PathParam( "packageType" ) String packageType,
                                   final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                                   final @PathParam( "path" ) String path, final @Context HttpServletRequest request,
                                   final @Context SecurityContext securityContext );
}
