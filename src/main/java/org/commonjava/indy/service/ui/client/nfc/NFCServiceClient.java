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
package org.commonjava.indy.service.ui.client.nfc;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/nfc" )
@RegisterRestClient( configKey = "service-api" )
//@RegisterProvider(CustomClientRequestFilter.class)
public interface NFCServiceClient
{

    @DELETE
    Response clearAll();

    @Path( "/{type: (hosted|group|remote)}/{name}{path}" )
    @DELETE
    @Deprecated
    Response deprecatedClearStore( @PathParam( "type" ) String t, @PathParam( "name" ) String name,
                                   @PathParam( "path" ) String p );

    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}{path}" )
    @DELETE
    Response clearStore( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String t,
                         @PathParam( "name" ) String name, @PathParam( "path" ) String p );

    @GET
    @Produces( APPLICATION_JSON )
    Response getAll( @QueryParam( "pageIndex" ) Integer pageIndex, @QueryParam( "pageSize" ) Integer pageSize );

    @GET
    @Path( "/info" )
    @Produces( APPLICATION_JSON )
    Response getInfo();

    @Path( "/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    @Deprecated
    Response deprecatedGetStore( @PathParam( "type" ) String t, @PathParam( "name" ) String name,
                                 @QueryParam( "pageIndex" ) Integer pageIndex,
                                 @QueryParam( "pageSize" ) Integer pageSize );

    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}/info" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getStoreInfo( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String t,
                           @PathParam( "name" ) String name );

    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getStore( @PathParam( "packageType" ) String packageType, @PathParam( "type" ) String t,
                       @PathParam( "name" ) String name,

                       @QueryParam( "pageIndex" ) Integer pageIndex,

                       @QueryParam( "pageSize" ) Integer pageSize );
}
