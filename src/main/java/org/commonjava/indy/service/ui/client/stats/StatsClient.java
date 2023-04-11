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
package org.commonjava.indy.service.ui.client.stats;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/stats" )
@RegisterRestClient( configKey = "service-api" )
public interface StatsClient
{

    @Path( "/addons/active" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getAddonList();

    @Path( "/addons/active.js" )
    @GET
    @Produces( APPLICATION_JSON )
    String getAddonInjectionJavascript();

    @Path( "/version-info" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getIndyVersion();

    @Path( "/package-type/map" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getPackageTypeMap();

    @Path( "/package-type/keys" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getPackageTypeNames();

    @Path( "/all-endpoints" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getAllEndpoints( @Context final UriInfo uriInfo );
}
