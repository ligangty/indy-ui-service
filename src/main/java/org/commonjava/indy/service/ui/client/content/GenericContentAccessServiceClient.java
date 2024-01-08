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

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HEAD;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import static org.commonjava.indy.service.ui.client.Constants.CHECK_CACHE_ONLY;

@Path( "/api/content/generic-http/{type: (hosted|group|remote)}/{name}" )
@RegisterRestClient( configKey = "service-api" )
public interface GenericContentAccessServiceClient
{

    @PUT
    @Path( "/{path}" )
    Response doCreate( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                       final @PathParam( "path" ) String path, final @Context UriInfo uriInfo,
                       final @Context HttpServletRequest request );

    @DELETE
    @Path( "/{path}" )
    Response doDelete( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                       final @PathParam( "path" ) String path,
                       final @QueryParam( CHECK_CACHE_ONLY ) Boolean cacheOnly );

    @HEAD
    @Path( "/{path}" )
    Response doHead( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                     final @PathParam( "path" ) String path, @QueryParam( CHECK_CACHE_ONLY ) final Boolean cacheOnly,
                     @Context final UriInfo uriInfo, @Context final HttpServletRequest request );

    @GET
    @Path( "/{path}" )
    Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                    final @PathParam( "path" ) String path, @Context final UriInfo uriInfo,
                    @Context final HttpServletRequest request );

    @GET
    @Path( "/" )
    Response doGet( final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                    @Context final UriInfo uriInfo, @Context final HttpServletRequest request );

}
