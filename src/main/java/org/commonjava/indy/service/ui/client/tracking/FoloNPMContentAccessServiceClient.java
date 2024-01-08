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
package org.commonjava.indy.service.ui.client.tracking;

import org.commonjava.indy.service.ui.client.Constants;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HEAD;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

@Path( "/api/folo/track/{id}/npm/{type: (hosted|group|remote)}/{name}" )
@RegisterRestClient( configKey = "service-api" )
public interface FoloNPMContentAccessServiceClient
{

    @PUT
    @Path( "/{packageName}" )
    Response doCreate( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                       @PathParam( "name" ) final String name, @PathParam( "packageName" ) final String packageName,
                       @Context final HttpServletRequest request, @Context final UriInfo uriInfo );

    @PUT
    @Path( "/{packageName}/{versionTarball}" )
    Response doCreate( @PathParam( "id" ) final String id, final @PathParam( "type" ) String type,
                       final @PathParam( "name" ) String name, final @PathParam( "packageName" ) String packageName,
                       final @PathParam( "versionTarball" ) String versionTarball, final @Context UriInfo uriInfo,
                       final @Context HttpServletRequest request );

    @HEAD
    @Path( "/{packageName}" )
    Response doHead( @PathParam( "id" ) final String id, final @PathParam( "type" ) String type,
                     final @PathParam( "name" ) String name, final @PathParam( "packageName" ) String packageName,
                     final @QueryParam( Constants.CHECK_CACHE_ONLY ) Boolean cacheOnly, final @Context UriInfo uriInfo,
                     final @Context HttpServletRequest request );

    @HEAD
    @Path( "/{packageName}/{versionTarball}" )
    Response doHead( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                     @PathParam( "name" ) final String name, final @PathParam( "packageName" ) String packageName,
                     final @PathParam( "versionTarball" ) String versionTarball,
                     final @QueryParam( Constants.CHECK_CACHE_ONLY ) Boolean cacheOnly, @Context final HttpServletRequest request,
                     @Context final UriInfo uriInfo );

    @GET
    @Path( "/{packageName}" )
    Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                    @PathParam( "name" ) final String name, final @PathParam( "packageName" ) String packageName,
                    @Context final HttpServletRequest request, @Context final UriInfo uriInfo );

    @GET
    @Path( "/{packageName}/{versionTarball}" )
    Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                    @PathParam( "name" ) final String name, final @PathParam( "packageName" ) String packageName,
                    final @PathParam( "versionTarball" ) String versionTarball,
                    @Context final HttpServletRequest request, @Context final UriInfo uriInfo );
}
