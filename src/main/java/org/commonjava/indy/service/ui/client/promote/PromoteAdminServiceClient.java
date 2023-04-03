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

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( PromoteAdminServiceClient.PROMOTION_ADMIN_API )
@RegisterRestClient( configKey = "service-api" )
public interface PromoteAdminServiceClient
{
    String PROMOTION_ADMIN_API = "/api/promotion/admin";

    @Path( "/validation/rules/all" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getAllRules( final @Context SecurityContext securityContext, final @Context UriInfo uriInfo );

    @Path( "/validation/rules/named/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getRule( final @PathParam( "name" ) String ruleName, final @Context SecurityContext securityContext,
                             final @Context UriInfo uriInfo );

    @Path( "/validation/rulesets/all" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getAllRuleSets( final @Context SecurityContext securityContext, final @Context UriInfo uriInfo );

    @Path( "/validation/rulesets" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getAllRuleSetsDefinitions( final @Context SecurityContext securityContext,
                                               final @Context UriInfo uriInfo );

    @Path( "/validation/rulesets/storekey/{storeKey}" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getRuleSetByStoreKey( final @PathParam( "storeKey" ) String storeKey,
                                          final @Context SecurityContext securityContext,
                                          final @Context UriInfo uriInfo );

    @Path( "/validation/rulesets/named/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    Response getRuleSetByName( final @PathParam( "name" ) String name,
                                      final @Context SecurityContext securityContext, final @Context UriInfo uriInfo );


}
