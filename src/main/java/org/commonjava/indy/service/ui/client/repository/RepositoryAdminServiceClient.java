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
package org.commonjava.indy.service.ui.client.repository;

import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.spi.HttpRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Path( "/api/admin/stores/{packageType}/{type: (hosted|group|remote)}" )
@RegisterRestClient( configKey = "service-api" )
public interface RepositoryAdminServiceClient
{

    @HEAD
    @Path( "/{name}" )
    Response repoExists( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String type,
                         @PathParam( "name" ) String name );

    @GET
    @Path( "/{name}" )
    Response getStore( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String type,
                       @PathParam( "name" ) String name );

    @POST
    Response createStore( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String type,
                          String repoJson );

    @Path( "/{name}" )
    @PUT
    @Consumes( APPLICATION_JSON )
    Response updateStore( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                          final @PathParam( "name" ) String name, final @Context HttpRequest request );

    @GET
    @Produces( APPLICATION_JSON )
    Response getAllStores( final @PathParam( "packageType" ) String packageType,
                           final @PathParam( "type" ) String type );

    @Path( "/{name}" )
    @DELETE
    Response deleteStore( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                          final @PathParam( "name" ) String name,
                          final @QueryParam( "deleteContent" ) boolean deleteContent,
                          @Context final HttpRequest request );

    @Path( "/query/byUrl" )
    @GET
    Response getRemoteByUrl( final @PathParam( "packageType" ) String packageType,
                             final @PathParam( "type" ) String type, final @QueryParam( "url" ) String url,
                             @Context final HttpRequest request );

    @Path( "/revalidate/all/" )
    @POST
    Response revalidateStores( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String type );

    @Path( "/{name}/revalidate" )
    @POST
    Response revalidateStore( final @PathParam( "packageType" ) String packageType,
                              final @PathParam( "type" ) String type, final @PathParam( "name" ) String name );

    @Path( "/invalid/all" )
    @GET
    Response getDisabledStores(
            final @Parameter( in = PATH, required = true ) @PathParam( "packageType" ) String packageType,
            final @Parameter( in = PATH, schema = @Schema( enumeration = { "remote" } ), required = true )
            @PathParam( "type" ) String type );
}
