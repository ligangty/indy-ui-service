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

import org.commonjava.indy.service.ui.client.repository.RepositoryAdminServiceClient;
import org.commonjava.indy.service.ui.models.repository.ArtifactStore;
import org.commonjava.indy.service.ui.models.repository.ArtifactStoreValidateData;
import org.commonjava.indy.service.ui.models.repository.StoreListingDTO;
import org.commonjava.indy.service.ui.models.repository.StoreType;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.spi.HttpRequest;

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
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( name = "Store Administration", description = "Resource for accessing and managing artifact store definitions" )
@Path( "/api/admin/stores/{packageType}/{type: (hosted|group|remote)}" )
@ApplicationScoped
public class RepositoryAdminResource
{

    @Inject
    @RestClient
    RepositoryAdminServiceClient client;

    @Operation( description = "Check if a given store exists" )
    @APIResponse( responseCode = "200", description = "The store exists" )
    @APIResponse( responseCode = "404", description = "The store doesn't exist" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @Path( "/{name}" )
    @HEAD
    public Response exists( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, @PathParam( "name" ) final String name )
    {
        return client.repoExists( packageType, type, name );
    }

    @Operation( description = "Create a new store" )
    @APIResponse( responseCode = "201", content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ),
                  description = "The store was created" )
    @APIResponse( responseCode = "409", description = "A store with the specified type and name already exists" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @RequestBody( description = "The artifact store definition JSON", name = "body", required = true,
                  content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ) )
    @POST
    @Consumes( APPLICATION_JSON )
    @Produces( APPLICATION_JSON )
    public Response create( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, final @Context UriInfo uriInfo,
                            final @Context HttpRequest request )
    {
        return client.createStore( packageType, type, request );
    }

    @Operation( description = "Update an existing store" )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ),
                  description = "The store was updated" )
    @APIResponse( responseCode = "400",
                  description = "The store specified in the body JSON didn't match the URL parameters" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @RequestBody( description = "The artifact store definition JSON", name = "body", required = true,
                  content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ) )
    @Path( "/{name}" )
    @PUT
    @Consumes( APPLICATION_JSON )
    public Response store( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                           final @PathParam( "name" ) String name, final @Context HttpRequest request )
    {
        return client.updateStore( packageType, type, name, request );
    }

    @Operation( description = "Retrieve the definitions of all artifact stores of a given type on the system" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAll( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type )
    {
        return client.getAllStores( packageType, type );
    }

    @Operation( description = "Retrieve the definition of a specific artifact store" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ),
                  description = "The store definition" )
    @APIResponse( responseCode = "404", description = "The store doesn't exist" )
    @Path( "/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response get( final @PathParam( "packageType" ) String packageType, final @PathParam( "type" ) String type,
                         final @PathParam( "name" ) String name )
    {
        return client.getStore( packageType, type, name );
    }

    @Operation( description = "Delete an artifact store" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "204", content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ),
                  description = "The store was deleted (or didn't exist in the first place)" )
    @Path( "/{name}" )
    @DELETE
    public Response delete( final @PathParam( "packageType" ) String packageType,
                            final @PathParam( "type" ) String type, final @PathParam( "name" ) String name,
                            final @QueryParam( "deleteContent" ) boolean deleteContent,
                            @Context final HttpRequest request )
    {
        return client.deleteStore( packageType, type, name, deleteContent, request );
    }

    @Operation( description = "Retrieve the definition of a remote by specific url" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The remote store definitions" )
    @APIResponse( responseCode = "404", description = "The remote repository doesn't exist" )
    @Path( "/query/byUrl" )
    @GET
    public Response getRemoteByUrl( final @PathParam( "packageType" ) String packageType,
                                    final @PathParam( "type" ) String type, final @QueryParam( "url" ) String url,
                                    @Context final HttpRequest request )
    {
        return client.getRemoteByUrl( packageType, type, url, request );
    }

    @Operation( description = "Revalidation of Artifacts Stored on demand" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = Map.class ) ),
                  description = "Revalidation for Remote Repositories was successfull" )
    @APIResponse( responseCode = "404", description = "Revalidation is not successfull" )
    @Path( "/revalidate/all/" )
    @POST
    public Response revalidateArtifactStores( @PathParam( "packageType" ) String packageType,
                                              @PathParam( "type" ) String type )
    {
        return client.revalidateStores( packageType, type );
    }

    @Operation( description = "Revalidation of Artifact Stored on demand based on package, type and name" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = ArtifactStoreValidateData.class ) ),
                  description = "Revalidation for Remote Repository was successful" )
    @APIResponse( responseCode = "404", description = "Revalidation is not successful" )
    @Path( "/{name}/revalidate" )
    @POST
    public Response revalidateArtifactStore( final @PathParam( "packageType" ) String packageType,
                                             final @PathParam( "type" ) String type,
                                             final @PathParam( "name" ) String name )
    {
        return client.revalidateStore( packageType, type, name );
    }

    @Operation( description = "Return All Invalidated Remote Repositories" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = PATH, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "type", in = PATH, description = "The type of the repository.",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ) ) } )
    @APIResponse( responseCode = "200", description = "Return All Invalidated Remote Repositories" )
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
