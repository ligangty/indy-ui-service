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
