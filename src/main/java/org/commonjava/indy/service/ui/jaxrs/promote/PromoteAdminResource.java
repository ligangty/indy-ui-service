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
package org.commonjava.indy.service.ui.jaxrs.promote;

import org.commonjava.indy.service.ui.client.promote.PromoteAdminServiceClient;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Tag( name = "Promote Administration", description = "Resource for managing configurations for promotion." )
@Path( PromoteAdminServiceClient.PROMOTION_ADMIN_API )
@ApplicationScoped
public class PromoteAdminResource
{

    @Inject
    @RestClient
    PromoteAdminServiceClient client;

    @Operation( description = "Get all rules' names" )
    @APIResponse( responseCode = "200", description = "All promotion validation rules' definition",
                  content = @Content( schema = @Schema( implementation = Response.class ) ) )
    @APIResponse( responseCode = "404", description = "No rules are defined" )
    @Path( "/validation/rules/all" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAllRules( final @Context SecurityContext securityContext, final @Context UriInfo uriInfo )
    {
        return client.getAllRules( securityContext, uriInfo );
    }

    @Operation( description = "Get promotion rule by rule name" )
    @APIResponse( responseCode = "200", description = "The promotion validation rule definition",
                  content = @Content( schema = @Schema( implementation = Response.class ) ) )
    @APIResponse( responseCode = "404", description = "The rule doesn't exist" )
    @Path( "/validation/rules/named/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getRule( final @PathParam( "name" ) String ruleName, final @Context SecurityContext securityContext,
                             final @Context UriInfo uriInfo )
    {
        return client.getRule( ruleName, securityContext, uriInfo );
    }

    @Operation( description = "Get promotion rule-set names" )
    @APIResponse( responseCode = "200", description = "The promotion validation rule-set names" )
    @Path( "/validation/rulesets/all" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAllRuleSets( final @Context SecurityContext securityContext, final @Context UriInfo uriInfo )
    {
        return client.getAllRuleSets( securityContext, uriInfo );
    }

    @Operation( description = "Get promotion rule-set definitions" )
    @APIResponse( responseCode = "200", description = "The promotion validation rule-set definitions" )
    @Path( "/validation/rulesets" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAllRuleSetsDefinitions( final @Context SecurityContext securityContext,
                                               final @Context UriInfo uriInfo )
    {
        return client.getAllRuleSetsDefinitions( securityContext, uriInfo );
    }

    @Operation( description = "Get promotion rule-set by store key" )
    @APIResponse( responseCode = "200", description = "The promotion validation rule-set definition" )
    @APIResponse( responseCode = "404", description = "The rule-set doesn't exist" )
    @Path( "/validation/rulesets/storekey/{storeKey}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getRuleSetByStoreKey( final @PathParam( "storeKey" ) String storeKey,
                                          final @Context SecurityContext securityContext,
                                          final @Context UriInfo uriInfo )
    {
        return client.getRuleSetByStoreKey( storeKey, securityContext, uriInfo );
    }

    @Operation( description = "Get promotion rule-set by name" )
    @APIResponse( responseCode = "200", description = "The promotion validation rule-set definition" )
    @APIResponse( responseCode = "404", description = "The rule-set doesn't exist" )
    @Path( "/validation/rulesets/named/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getRuleSetByName( final @PathParam( "name" ) String name,
                                      final @Context SecurityContext securityContext, final @Context UriInfo uriInfo )
    {
        return client.getRuleSetByName( name, securityContext, uriInfo );
    }

}
