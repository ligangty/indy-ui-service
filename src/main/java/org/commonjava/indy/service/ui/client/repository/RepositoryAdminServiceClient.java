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

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HEAD;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
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
    @Consumes( APPLICATION_JSON )
    Response createStore( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String type,
                          String repoJson );

    @Path( "/{name}" )
    @PUT
    @Consumes( APPLICATION_JSON )
    Response updateStore( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                          final @PathParam( "name" ) String name, final String repoJson );

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
