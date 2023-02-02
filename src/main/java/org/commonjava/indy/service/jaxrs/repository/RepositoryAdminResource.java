/**
 * Copyright (C) 2023 Red Hat, Inc.
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
package org.commonjava.indy.service.jaxrs.repository;

import org.commonjava.indy.service.client.repository.RepositoryAdminServiceClient;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.spi.HttpRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HEAD;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Path( "/api/admin/stores/{packageType}/{type: (hosted|group|remote)}" )
@ApplicationScoped
public class RepositoryAdminResource
{

    private final Logger logger = LoggerFactory.getLogger( getClass() );

    @Inject
    @RestClient
    RepositoryAdminServiceClient client;

    @Path( "/{name}" )
    @HEAD
    public Response exists( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, @PathParam( "name" ) final String name )
    {
        return client.repoExists( packageType, type, name );
    }

    @POST
    @Consumes( APPLICATION_JSON )
    @Produces( APPLICATION_JSON )
    public Response create( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, final @Context UriInfo uriInfo,
                            final @Context HttpRequest request )
    {
        return client.createStore( packageType, type, request );
    }

    @Path( "/{name}" )
    @PUT
    @Consumes( APPLICATION_JSON )
    public Response store( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                           final @PathParam( "name" ) String name, final @Context HttpRequest request )
    {
        return client.updateStore( packageType, type, name, request );
    }

    @GET
    @Produces( APPLICATION_JSON )
    public Response getAll( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type )
    {
        return client.getAllStores( packageType, type );
    }

    @Path( "/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response get( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                         final @PathParam( "name" ) String name )
    {
        return client.getStore( packageType, type, name );
    }

    @Path( "/{name}" )
    @DELETE
    public Response delete( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                            final @QueryParam( "deleteContent" ) boolean deleteContent,
                            @Context final HttpRequest request )
    {
        return client.deleteStore( packageType, type, name, deleteContent, request );
    }

    @Path( "/query/byUrl" )
    @GET
    public Response getRemoteByUrl( final @PathParam( "packageType" ) String packageType,
                                    final @PathParam( "type" ) String type, final @QueryParam( "url" ) String url,
                                    @Context final HttpRequest request )
    {
        return client.getRemoteByUrl( packageType, type, url, request );
    }

    @Path( "/revalidate/all/" )
    @POST
    public Response revalidateArtifactStores( @PathParam( "packageType" ) String packageType,
                                              @PathParam( "type" ) String type )
    {
        return client.revalidateStores( packageType, type );
    }

    @Path( "/{name}/revalidate" )
    @POST
    public Response revalidateArtifactStore( final @PathParam( "packageType" ) String packageType,
                                             final @PathParam( "type" ) String type,
                                             final @PathParam( "name" ) String name )
    {
        return client.revalidateStore( packageType, type, name );
    }

    @Path( "/invalid/all" )
    @GET
    public Response returnDisabledStores(
            final @Parameter( in = PATH, required = true ) @PathParam( "packageType" ) String packageType,
            final @Parameter( in = PATH, schema = @Schema( enumeration = { "remote" } ), required = true )
            @PathParam( "type" ) String type )
    {
        return client.getDisabledStores( packageType, type );
    }
}
