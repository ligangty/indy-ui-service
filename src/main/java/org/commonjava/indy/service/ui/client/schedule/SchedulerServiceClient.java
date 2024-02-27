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
package org.commonjava.indy.service.ui.client.schedule;

import org.commonjava.indy.service.ui.models.repository.StoreType;
import org.commonjava.indy.service.ui.models.schedule.Expiration;
import org.commonjava.indy.service.ui.models.schedule.ExpirationSet;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/admin/schedule" )
@Produces( APPLICATION_JSON )
@RegisterRestClient( configKey = "service-api" )
public interface SchedulerServiceClient
{
    @Path( "store/{type}/{name}/disable-timeout" )
    @GET
    @Deprecated
    Response deprecatedGetStoreDisableTimeout(
            @Parameter( content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true )
            @PathParam( "type" ) String storeType,
            @Parameter( required = true ) @PathParam( "name" ) String storeName );

    @Path( "store/{packageType}/{type}/{name}/disable-timeout" )
    @GET
    Expiration getStoreDisableTimeout(
            @Parameter( description = "Package type (maven, generic-http, npm, etc)", required = true )
            @PathParam( "packageType" ) String packageType,
            @Parameter( content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true )
            @PathParam( "type" ) String storeType,
            @Parameter( required = true ) @PathParam( "name" ) String storeName );

    @Path( "store/all/disable-timeout" )
    @GET
    ExpirationSet getDisabledStores();
}
