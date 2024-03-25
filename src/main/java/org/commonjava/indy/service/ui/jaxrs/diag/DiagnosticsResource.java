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
package org.commonjava.indy.service.ui.jaxrs.diag;

import org.apache.commons.io.IOUtils;
import org.commonjava.indy.service.ui.client.diag.DiagnosticsServiceClient;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.StreamingOutput;

import java.io.InputStream;

import static jakarta.ws.rs.core.MediaType.TEXT_PLAIN;

/**
 * REST resource to expose diagnostic retrieval options
 */
@Tag( name = "Diagnostics",
      description = "Tools to aid users when something goes wrong on the server, and you don't have access to logs." )
@Path( "/api/diag" )
public class DiagnosticsResource
{
    @Inject
    @RestClient
    DiagnosticsServiceClient client;

    @Operation( description = "Retrieve a thread dump for Indy." )
    @APIResponse( responseCode = "200", description = "Thread dump content" )
    @GET
    @Path( "/threads" )
    @Produces( TEXT_PLAIN )
    public Response getThreadDump()
    {
        return client.getThreadDump();
    }

    @Operation( description = "Retrieve a ZIP-compressed file containing log files and a thread dump for Indy." )
    @APIResponses( { @APIResponse( responseCode = "200", description = "ZIP bundle" ),
            @APIResponse( responseCode = "500", description = "Log files could not be found / accessed" ) } )
    @GET
    @Path( "/bundle" )
    @Produces( "application/zip" )
    public Response getBundle()
    {
        return streamBinContent( client.getBundle() );
    }

    @Operation( description = "Retrieve a ZIP-compressed file containing all repository definitions." )
    @APIResponses( { @APIResponse( responseCode = "200", description = "ZIP bundle" ),
            @APIResponse( responseCode = "500", description = "Repository files could not be found / accessed" ) } )
    @GET
    @Path( "/repo" )
    @Produces( "application/zip" )
    public Response getRepoBundle()
    {
        return streamBinContent( client.getRepoBundle() );
    }

    private Response streamBinContent( final Response response )
    {
        final InputStream clientIn = response.readEntity( InputStream.class );
        StreamingOutput out = output -> IOUtils.copy( clientIn, output );
        return Response.status( response.getStatus() ).entity( out ).replaceAll( response.getHeaders() ).build();
    }

}
