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
package org.commonjava.indy.service.ui.jaxrs.koji;

import org.commonjava.indy.service.ui.client.koji.KojiRepairServiceClient;
import org.commonjava.indy.service.ui.models.koji.KojiMultiRepairResult;
import org.commonjava.indy.service.ui.models.koji.KojiRepairRequest;
import org.commonjava.indy.service.ui.models.koji.KojiRepairResult;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.parameters.RequestBody;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.inject.Inject;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.SecurityContext;
import jakarta.ws.rs.core.UriInfo;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.QUERY;

@Tag( name = "Koji repairVolume operation", description = "Repair Koji remote repositories." )
@Path( "/api/repair/koji" )
@Produces( APPLICATION_JSON )
public class KojiRepairResource
{
    @Inject
    @RestClient
    KojiRepairServiceClient client;

    @Operation( description = "Repair koji repository remote url /vol." )
    @APIResponse( responseCode = "200",
                  description = "Operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = KojiRepairResult.class ) ) )
    @RequestBody( name = "body", description = "JSON request specifying source and other configuration options",
                  required = true, content = @Content( schema = @Schema( implementation = KojiRepairRequest.class ) ) )
    @POST
    @Path( "/vol" )
    @Consumes( APPLICATION_JSON )
    public KojiRepairResult repairVolumes( final KojiRepairRequest request,
                                           final @Context HttpServletRequest servletRequest,
                                           final @Context SecurityContext securityContext,
                                           final @Context UriInfo uriInfo )
    {
        return client.repairVolumes( request, servletRequest, securityContext, uriInfo );
    }

    @Operation( description = "Repair koji repository path masks." )
    @APIResponse( responseCode = "200",
                  description = "Operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = KojiRepairResult.class ) ) )
    @RequestBody( name = "body", description = "JSON request specifying source and other configuration options",
                  required = true, content = @Content( schema = @Schema( implementation = KojiRepairRequest.class ) ) )
    @POST
    @Path( "/mask" )
    @Consumes( APPLICATION_JSON )
    public KojiRepairResult repairPathMasks( final KojiRepairRequest request,
                                             final @Context HttpServletRequest servletRequest,
                                             final @Context SecurityContext securityContext,
                                             final @Context UriInfo uriInfo )
    {
        return client.repairPathMasks( request, servletRequest, securityContext, uriInfo );
    }

    @Operation( description = "Repair koji repository path masks for ALL koji remote repositories." )
    @APIResponse( responseCode = "200",
                  description = "Operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = KojiMultiRepairResult.class ) ) )
    @POST
    @Path( "mask/all" )
    @Consumes( APPLICATION_JSON )
    public KojiMultiRepairResult repairAllPathMasks( final @Context HttpServletRequest servletRequest,
                                                     final @Context SecurityContext securityContext,
                                                     final @Context UriInfo uriInfo )
    {
        return client.repairAllPathMasks( servletRequest, securityContext, uriInfo );
    }

    @Operation( description = "Repair koji repository metadata timeout to \"never timeout(-1)\"." )
    @APIResponse( responseCode = "200",
                  description = "Operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = KojiRepairResult.class ) ) )
    @RequestBody( name = "body", description = "JSON request specifying source and other configuration options",
                  required = true, content = @Content( schema = @Schema( implementation = KojiRepairRequest.class ) ) )
    @POST
    @Path( "metadata/timeout" )
    @Consumes( APPLICATION_JSON )
    public KojiRepairResult repairMetadataTimeout( final KojiRepairRequest request,
                                                   final @Context HttpServletRequest servletRequest,
                                                   final @Context SecurityContext securityContext )
    {
        return client.repairMetadataTimeout( request, servletRequest, securityContext );
    }

    @Operation(
            description = "Repair koji repository metadata timeout to \"never timeout(-1)\" for all koji remote repositories." )
    @Parameter( name = "isDryRun", in = QUERY,
                description = "boolean value to specify if this request is a dry run request. Default is false.",
                hidden = true, content = @Content( schema = @Schema( implementation = Boolean.class ) ) )
    @APIResponse( responseCode = "200",
                  description = "Operation finished (consult response content for success/failure).",
                  content = @Content( schema = @Schema( implementation = KojiMultiRepairResult.class ) ) )
    @POST
    @Path( "metadata/timeout/all" )
    @Consumes( APPLICATION_JSON )
    public KojiMultiRepairResult repairAllMetadataTimeout( final @Context HttpServletRequest servletRequest,
                                                           final @QueryParam( "isDryRun" ) Boolean isDryRun,
                                                           final @Context SecurityContext securityContext )
    {

        return client.repairAllMetadataTimeout( servletRequest, isDryRun, securityContext );
    }

}
