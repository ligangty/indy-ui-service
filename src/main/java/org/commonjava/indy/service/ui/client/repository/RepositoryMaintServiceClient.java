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

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.spi.HttpRequest;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/admin/stores/maint" )
@RegisterRestClient( configKey = "service-api" )
public interface RepositoryMaintServiceClient
{
    String MEDIATYPE_APPLICATION_ZIP = "application/zip";

    @GET
    @Path( "/export" )
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    Response getRepoBundle();

    @POST
    @Path( "/import" )
    @Consumes( MEDIATYPE_APPLICATION_ZIP )
    @Produces( APPLICATION_JSON )
    Response importRepoBundle( @Context final HttpRequest request );
}
