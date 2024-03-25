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

import org.commonjava.indy.service.ui.client.repository.RepositoryQueryServiceClient;
import org.commonjava.indy.service.ui.models.repository.ArtifactStore;
import org.commonjava.indy.service.ui.models.repository.SimpleBooleanResultDTO;
import org.commonjava.indy.service.ui.models.repository.StoreListingDTO;
import org.commonjava.indy.service.ui.models.stats.EndpointViewListing;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameters;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Encoded;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Response;
import java.util.Map;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.QUERY;

@Tag( name = "Store Querying APIs", description = "Resource for querying artifact store definitions" )
@Path( "/api/admin/stores/query" )
@ApplicationScoped
public class RepositoryQueryResource
{

    @Inject
    @RestClient
    RepositoryQueryServiceClient client;

    @Operation( description = "Retrieve all repository definitions" )
    @Parameters( value = {
            @Parameter( name = "packageType", in = QUERY, description = "The package type of the repository.",
                        example = "maven, npm, generic-http" ),
            @Parameter( name = "types", in = QUERY, description = "The types of the repository. Split by comma",
                        example = "\"remote, hosted\"" ), @Parameter( name = "enabled", in = QUERY,
                                                                      description = "If the repositories retrieved are enabled, default is true if not specified",
                                                                      example = "true|false" ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @Path( "/all" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAll( @QueryParam( "packageType" ) final String packageType,
                            @QueryParam( "types" ) final String repoTypes,
                            @QueryParam( "enabled" ) final String enabled )
    {
        return client.getAll( packageType, repoTypes, enabled );
    }

    @Operation( description = "Retrieve all remote repository definitions by specified package type" )
    @Parameters( value = { @Parameter( name = "packageType", in = QUERY,
                                       description = "package type for the remotes, default is maven if not specified",
                                       example = "maven, npm, generic-http" ), @Parameter( name = "enabled", in = QUERY,
                                                                                           description = "If the repositories retrieved are enabled, default is true if not specified",
                                                                                           example = "true|false" ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/remotes/all" )
    @Produces( APPLICATION_JSON )
    public Response getAllRemoteRepositories( @QueryParam( "packageType" ) final String packageType,
                                              @QueryParam( "enabled" ) final String enabled )
    {
        return client.getAllRemoteRepositories( packageType, enabled );
    }

    @Operation( description = "Retrieve all hosted repository definitions by specified package type" )
    @Parameters( value = { @Parameter( name = "packageType", in = QUERY,
                                       description = "package type for the hosted repos, default is maven if not specified",
                                       example = "maven, npm" ), @Parameter( name = "enabled", in = QUERY,
                                                                             description = "If the repositories retrieved are enabled, default is true if not specified",
                                                                             example = "true|false" ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/hosteds/all" )
    @Produces( APPLICATION_JSON )
    public Response getAllHostedRepositories( @QueryParam( "packageType" ) final String packageType,
                                              @QueryParam( "enabled" ) final String enabled )
    {
        return client.getAllHostedRepositories( packageType, enabled );
    }

    @Operation( description = "Retrieve all group definitions by specified package type" )
    @Parameters( value = { @Parameter( name = "packageType", in = QUERY,
                                       description = "package type for the groups, default is maven if not specified",
                                       example = "maven, npm" ), @Parameter( name = "enabled", in = QUERY,
                                                                             description = "If the repositories retrieved are enabled, default is true if not specified",
                                                                             example = "true|false" ) } )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/groups/all" )
    @Produces( APPLICATION_JSON )
    public Response getAllGroups( @QueryParam( "packageType" ) final String packageType,
                                  @QueryParam( "enabled" ) final String enabled )
    {
        return client.getAllGroups( packageType, enabled );
    }

    @Operation( description = "Retrieve all default package types" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/byDefaultPkgTypes" )
    @Produces( APPLICATION_JSON )
    public Response getAllByDefaultPackageTypes()
    {
        return client.getAllByDefaultPackageTypes();
    }

    @Operation( description = "Retrieve the first matched store with the given store name" )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = ArtifactStore.class ) ),
                  description = "The store definition" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/byName/{name}" )
    @Produces( APPLICATION_JSON )
    public Response getByName(
            @Parameter( description = "Name of the repository", in = PATH, required = true ) @PathParam( "name" )
            String name )
    {
        return client.getByName( name );
    }

    @Operation( description = "Retrieve the enabled groups whose constituents contains the specified store" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/groups/contains" )
    @Produces( APPLICATION_JSON )
    public Response getGroupsContaining(
            @Parameter( description = "Key of the repository contained in the groups", required = true,
                        example = "maven:remote:central" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled )
    {
        return client.getGroupsContaining( storeKey, enabled );
    }

    @Operation( description = "Retrieve the concrete stores which are constituents of the specified group" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The store definitions" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/concretes/inGroup" )
    @Produces( APPLICATION_JSON )
    public Response getOrderedConcreteStoresInGroup(
            @Parameter( description = "Key of the group whom the repositories are contained in", required = true,
                        example = "maven:group:public" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled )
    {
        return client.getOrderedConcreteStoresInGroup( storeKey, enabled );
    }

    @Operation( description = "Retrieve the stores which are constituents of the specified group" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The stores definitions, include the master group itself" )
    @APIResponse( responseCode = "404", description = "The stores are not found" )
    @GET
    @Path( "/inGroup" )
    @Produces( APPLICATION_JSON )
    public Response getOrderedStoresInGroup(
            @Parameter( description = "Key of the group whom the repositories are contained in", required = true,
                        example = "maven:group:public" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled )
    {
        return client.getOrderedStoresInGroup( storeKey, enabled );
    }

    @Operation( description = "Retrieve the groups which are affected by the specified store keys" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The group definitions" )
    @APIResponse( responseCode = "404", description = "The groups don't exist" )
    @GET
    @Path( "/affectedBy" )
    @Produces( APPLICATION_JSON )
    public Response getGroupsAffectedBy(
            @Parameter( description = "Store keys whom the groups are affected by, use \",\" to split", required = true,
                        example = "maven:remote:central,maven:hosted:local" ) @QueryParam( "keys" ) @Encoded
            final String keys )
    {
        return client.getGroupsAffectedBy( keys );
    }

    @Operation( description = "Retrieve the remote repositories by package type and urls." )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = StoreListingDTO.class ) ),
                  description = "The remote repository definitions" )
    @APIResponse( responseCode = "404", description = "The remote repositories don't exist" )
    @GET
    @Path( "/remotes" )
    public Response getRemoteRepositoryByUrl( @QueryParam( "packageType" ) final String packageType,
                                              @QueryParam( "byUrl" ) final String url,
                                              @QueryParam( "enabled" ) final String enabled )
    {
        return client.getRemoteRepositoryByUrl( packageType, url, enabled );
    }

    @Operation( description = "Check if there are no repository definitions." )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = SimpleBooleanResultDTO.class ) ),
                  description = "If there are repository definitions or not." )
    @GET
    @Path( "/isEmpty" )
    public Response getStoreEmpty()
    {
        return client.isStoreEmpty();
    }

    @Operation(
            summary = "Retrieve a listing of the artifact stores available on the system. This is especially useful for setting up a network of Indy instances that reference one another" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = EndpointViewListing.class ) ),
                  description = "The artifact store listing" )
    @Path( "/endpoints/{packageType}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getEndpoints( @PathParam( "packageType" ) final String pkgType )
    {
        return client.getEndpoints( pkgType );
    }

    @Operation( summary = "Retrieve a listing of the artifact stores keys available on the system." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = Map.class ) ),
                  description = "The artifact store keys listing" )
    @Path( "/storekeys/{packageType}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getStoreKeys( @PathParam( "packageType" ) final String pkgType )
    {
        return client.getStoreKeys( pkgType );
    }

}
