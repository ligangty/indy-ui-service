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
package org.commonjava.indy.service.ui.client.promote;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.spi.HttpRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/promotion" )
@Produces( APPLICATION_JSON )
@RegisterRestClient( configKey = "service-api" )
public interface PromoteServiceClient
{

    @Path( "/paths/promote" )
    @POST
    @Consumes( APPLICATION_JSON )
    Response promotePaths( final @Context HttpRequest request, final @Context UriInfo uriInfo );

    @Path( "/paths/rollback" )
    @POST
    @Consumes( APPLICATION_JSON )
    Response rollbackPaths( final @Context HttpRequest request, @Context final UriInfo uriInfo );

}
