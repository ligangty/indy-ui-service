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
package org.commonjava.indy.service.ui.jaxrs.schedule;

import org.commonjava.indy.service.ui.client.schedule.SchedulerServiceClient;
import org.commonjava.indy.service.ui.models.repository.StoreType;
import org.commonjava.indy.service.ui.models.schedule.Expiration;
import org.commonjava.indy.service.ui.models.schedule.ExpirationSet;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Tag( name = "Schedules and Expirations",
      description = "Retrieve and manipulate scheduled expirations for various parts of Indy" )
@Path( "/api/admin/schedule" )
@Produces( APPLICATION_JSON )
public class SchedulerResource
{

    @Inject
    @RestClient
    SchedulerServiceClient client;

    @Operation(
            description = "[Deprecated] Retrieve the expiration information related to re-enablement of a repository" )
    @APIResponses( { @APIResponse( responseCode = "200", description = "Expiration information retrieved successfully.",
                                   content = @Content( schema = @Schema( implementation = Expiration.class ) ) ),
            @APIResponse( responseCode = "400",
                          description = "Store is manually disabled (doesn't automatically re-enable), or isn't disabled." ) } )
    @Path( "store/{type: (hosted|group|remote)}/{name}/disable-timeout" )
    @GET
    @Deprecated
    public Response deprecatedGetStoreDisableTimeout(
            @Parameter( content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true )
            @PathParam( "type" ) String storeType, @Parameter( required = true ) @PathParam( "name" ) String storeName )
    {
        return client.deprecatedGetStoreDisableTimeout( storeType, storeName );
    }

    @Operation( description = "Retrieve the expiration information related to re-enablement of a repository" )
    @APIResponses( { @APIResponse( responseCode = "200", description = "Expiration information retrieved successfully.",
                                   content = @Content( schema = @Schema( implementation = Expiration.class ) ) ),
            @APIResponse( responseCode = "400",
                          description = "Store is manually disabled (doesn't automatically re-enable), or isn't disabled." ) } )
    @Path( "store/{packageType}/{type: (hosted|group|remote)}/{name}/disable-timeout" )
    @GET
    public Expiration getStoreDisableTimeout(
            @Parameter( description = "Package type (maven, generic-http, npm, etc)", required = true )
            @PathParam( "packageType" ) String packageType,
            @Parameter( content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true )
            @PathParam( "type" ) String storeType, @Parameter( required = true ) @PathParam( "name" ) String storeName )
    {
        return client.getStoreDisableTimeout( packageType, storeType, storeName );
    }

    @Operation(
            description = "Retrieve the expiration information related to re-enablement of any currently disabled repositories" )
    @APIResponse( responseCode = "200", description = "List of disabled repository re-enablement timeouts.",
                  content = @Content( schema = @Schema( implementation = ExpirationSet.class ) ) )
    @Path( "store/all/disable-timeout" )
    @GET
    public ExpirationSet getDisabledStores()
    {
        return client.getDisabledStores();
    }
}
