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

import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;
import org.jboss.resteasy.spi.HttpRequest;

import javax.ws.rs.Consumes;
import javax.ws.rs.Encoded;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static javax.ws.rs.core.Response.Status.BAD_REQUEST;
import static javax.ws.rs.core.Response.ok;

@Path( "/api/admin/stores/query" )
@RegisterRestClient( configKey = "service-api" )
//@RegisterProvider(CustomClientRequestFilter.class)
public interface RepositoryQueryServiceClient
{
    Response getAll( @QueryParam( "packageType" ) final String packageType,
                     @QueryParam( "types" ) final String repoTypes, @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/remotes/all" )
    @Produces( APPLICATION_JSON )
    Response getAllRemoteRepositories(
            @Parameter( description = "package type for the remotes, default is maven if not specified",
                        example = "maven|npm" ) @QueryParam( "packageType" ) final String packageType,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/hosteds/all" )
    @Produces( APPLICATION_JSON )
    Response getAllHostedRepositories(
            @Parameter( description = "package type for the hosted repos, default is maven if not specified",
                        example = "maven|npm" ) @QueryParam( "packageType" ) final String packageType,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/groups/all" )
    @Produces( APPLICATION_JSON )
    Response getAllGroups( @Parameter( description = "package type for the groups,  default is maven if not specified",
                                       example = "maven|npm" ) @QueryParam( "packageType" ) final String packageType,
                           @Parameter(
                                   description = "If the repositories retrieved are enabled, default is true if not specified",
                                   example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/byDefaultPkgTypes" )
    @Produces( APPLICATION_JSON )
    Response getAllByDefaultPackageTypes();

    @GET
    @Path( "/byName/{name}" )
    @Produces( APPLICATION_JSON )
    Response getByName(
            @Parameter( description = "Name of the repository", required = true ) @PathParam( "name" ) String name );

    @GET
    @Path( "/groups/contains" )
    @Produces( APPLICATION_JSON )
    Response getGroupsContaining(
            @Parameter( description = "Key of the repository contained in the groups", required = true,
                        example = "maven:remote:central" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/concretes/inGroup" )
    @Produces( APPLICATION_JSON )
    Response getOrderedConcreteStoresInGroup(
            @Parameter( description = "Key of the group whom the repositories are contained in", required = true,
                        example = "maven:group:public" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/inGroup" )
    @Produces( APPLICATION_JSON )
    Response getOrderedStoresInGroup(
            @Parameter( description = "Key of the group whom the repositories are contained in", required = true,
                        example = "maven:group:public" ) @QueryParam( "storeKey" ) @Encoded final String storeKey,
            @Parameter( description = "If the repositories retrieved are enabled, default is true if not specified",
                        example = "true" ) @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/affectedBy" )
    @Produces( APPLICATION_JSON )
    Response getGroupsAffectedBy(
            @Parameter( description = "Store keys whom the groups are affected by, use \",\" to split", required = true,
                        example = "maven:remote:central,maven:hosted:local" ) @QueryParam( "keys" ) @Encoded
            final String keys );

    @GET
    @Path( "/remotes" )
    Response getRemoteRepositoryByUrl( @QueryParam( "packageType" ) final String packageType,
                                       @QueryParam( "byUrl" ) final String url,
                                       @QueryParam( "enabled" ) final String enabled );

    @GET
    @Path( "/isEmpty" )
    Response isStoreEmpty();
}
