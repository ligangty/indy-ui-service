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
package org.commonjava.indy.service.client.tracking;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static org.commonjava.indy.service.client.Constants.CHECK_CACHE_ONLY;

@Path( "/api/folo/track/{id}/generic-http/{type: (hosted|group|remote)}/{name}" )
@RegisterRestClient( configKey = "service-api" )
//@RegisterProvider( CustomClientRequestFilter.class)
public interface FoloGenericContentAccessServiceClient
{

    @PUT
    @Path( "/{path}" )
    Response doCreate( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                       @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                       @Context final HttpServletRequest request, @Context final UriInfo uriInfo );

    @HEAD
    @Path( "/{path}" )
    Response doHead( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                     @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                     @QueryParam( CHECK_CACHE_ONLY ) final Boolean cacheOnly, @Context final HttpServletRequest request,
                     @Context final UriInfo uriInfo );

    @GET
    @Path( "/{path}" )
    Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                    @PathParam( "name" ) final String name, @PathParam( "path" ) final String path,
                    @Context final HttpServletRequest request, @Context final UriInfo uriInfo );

    @GET
    @Path( "/" )
    Response doGet( @PathParam( "id" ) final String id, @PathParam( "type" ) final String type,
                    @PathParam( "name" ) final String name, @Context final HttpServletRequest request,
                    @Context final UriInfo uriInfo );

}
