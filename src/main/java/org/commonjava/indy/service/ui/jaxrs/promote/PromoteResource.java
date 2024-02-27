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

import org.commonjava.indy.service.ui.client.promote.PromoteServiceClient;
import org.commonjava.indy.service.ui.models.promote.PathsPromoteRequest;
import org.commonjava.indy.service.ui.models.promote.PathsPromoteResult;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.resteasy.spi.HttpRequest;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Tag( name = "Content Promotion", description = "Promote content from a source repository to a target repository." )
@Path( "/api/promotion" )
@Produces( APPLICATION_JSON )
@ApplicationScoped
public class PromoteResource
{

    @Inject
    @RestClient
    PromoteServiceClient client;

    @Operation(
            description = "Promote paths from a source repository into a target repository/group (subject to validation)." )
    @APIResponse( responseCode = "200",
                  description = "Promotion operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = PathsPromoteResult.class ) ) )
    @RequestBody( description = "JSON request specifying source and target, with other configuration options",
                  content = @Content( schema = @Schema( implementation = PathsPromoteRequest.class ) ) )
    @Path( "/paths/promote" )
    @POST
    @Consumes( APPLICATION_JSON )
    public Response promotePaths( final @Context HttpRequest request, final @Context UriInfo uriInfo )
    {

        return client.promotePaths( request, uriInfo );
    }

    @Operation(
            description = "Rollback promotion of any completed paths to a source repository from a target repository/group." )
    @APIResponse( responseCode = "200",
                  description = "Promotion operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = PathsPromoteResult.class ) ) )
    @RequestBody(
            description = "JSON result from previous attempt, specifying source and target, with other configuration options",
            content = @Content( schema = @Schema( implementation = PathsPromoteResult.class ) ) )
    @Path( "/paths/rollback" )
    @POST
    @Consumes( APPLICATION_JSON )
    public Response rollbackPaths( final @Context HttpRequest request, @Context final UriInfo uriInfo )
    {

        return client.rollbackPaths( request, uriInfo );
    }

}
