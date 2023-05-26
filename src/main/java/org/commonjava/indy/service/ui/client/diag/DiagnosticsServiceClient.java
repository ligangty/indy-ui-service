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
package org.commonjava.indy.service.ui.client.diag;

import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.TEXT_PLAIN;

@Path( "/api/diag" )
@RegisterRestClient( configKey = "service-api" )
public interface DiagnosticsServiceClient
{
    @GET
    @Path( "/threads" )
    @Produces( TEXT_PLAIN )
    Response getThreadDump();

    @GET
    @Path( "/bundle" )
    @Produces( "application/zip" )
    Response getBundle();

    @GET
    @Path( "/repo" )
    @Produces( "application/zip" )
    Response getRepoBundle();
}
