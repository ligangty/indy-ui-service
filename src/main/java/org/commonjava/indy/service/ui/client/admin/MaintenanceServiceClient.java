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
package org.commonjava.indy.service.ui.client.admin;

import org.commonjava.indy.service.ui.models.admin.BatchDeleteRequest;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/admin/maint" )
@RegisterRestClient( configKey = "service-api" )
public interface MaintenanceServiceClient
{

    @Path( "/rescan/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Deprecated
    Response deprecatedRescan( final @PathParam( "type" ) String type, @PathParam( "name" ) final String name );

    @Path( "/rescan/{packageType}/{type: (hosted|group|remote)}/{name}" )
    @GET
    Response rescan( @PathParam( "packageType" ) final String packageType, final @PathParam( "type" ) String type,
                     @PathParam( "name" ) final String name );

    @Path( "/rescan/all" )
    @GET
    Response rescanAll();

    @Deprecated
    @Path( "/delete/all{path: (/.+)?}" )
    @DELETE
    Response deleteAllViaGet( final @PathParam( "path" ) String path );

    @Path( "/content/all{path: (/.+)?}" )
    @DELETE
    Response deleteAll( final @PathParam( "path" ) String path );

    @Path( "/infinispan/cache/{name}" )
    @DELETE
    Response cleanInfinispanCache( @PathParam( "name" ) final String name );

    @Produces( "application/json" )
    @Path( "/infinispan/cache/{name}{key: (/.+)?}" )
    @GET
    Response exportInfinispanCache( @PathParam( "name" ) final String name, @PathParam( "key" ) final String key );

    @Produces( "application/json" )
    @Path( "/store/affected/{key}" )
    @GET
    Response affectedBy( @PathParam( "key" ) final String key );

    @Produces( APPLICATION_JSON )
    @Path( "/stores/tombstone/{packageType}/hosted" )
    @GET
    Response getTombstoneStores( @PathParam( "packageType" ) final String packageType );

    @Path( "/content/batch/delete" )
    @POST
    Response doDelete( final BatchDeleteRequest request );

    @Path( "/store/import" )
    @PUT
    Response importStore( final @Context UriInfo uriInfo, final @Context HttpServletRequest request );
}
