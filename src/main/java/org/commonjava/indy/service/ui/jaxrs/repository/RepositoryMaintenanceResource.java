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
package org.commonjava.indy.service.ui.jaxrs.repository;

import org.commonjava.indy.service.ui.client.repository.RepositoryMaintServiceClient;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.spi.HttpRequest;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.commonjava.indy.service.ui.client.repository.RepositoryMaintServiceClient.MEDIATYPE_APPLICATION_ZIP;

@Tag( name = "Store Administration", description = "Resource for accessing and managing artifact store definitions" )
@Path( "/api/admin/stores/maint" )
@ApplicationScoped
public class RepositoryMaintenanceResource
{

    @Inject
    @RestClient
    RepositoryMaintServiceClient client;

    @Operation( description = "Retrieve a ZIP-compressed file containing all repository definitions." )
    @APIResponse( responseCode = "200", description = "The zip file contains all repos definitions" )
    @GET
    @Path( "/export" )
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    public Response getRepoBundle()
    {
        return client.getRepoBundle();
    }

    @Operation(
            description = "Import a ZIP-compressed file containing repository definitions into the repository management database." )
    @APIResponse( responseCode = "200", description = "All repository definitions which are imported successfully." )
    @POST
    @Path( "/import" )
    @Consumes( MEDIATYPE_APPLICATION_ZIP )
    @Produces( APPLICATION_JSON )
    public Response importRepoBundle( @Context final HttpRequest request )
    {
        return client.importRepoBundle( request );
    }
}
