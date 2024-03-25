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
package org.commonjava.indy.service.ui.client.koji;

import org.commonjava.indy.service.ui.models.koji.KojiMultiRepairResult;
import org.commonjava.indy.service.ui.models.koji.KojiRepairRequest;
import org.commonjava.indy.service.ui.models.koji.KojiRepairResult;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

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

@Path( "/api/repair/koji" )
@Produces( APPLICATION_JSON )
@RegisterRestClient( configKey = "service-api" )
public interface KojiRepairServiceClient
{

    @POST
    @Path( "/vol" )
    @Consumes( APPLICATION_JSON )
    KojiRepairResult repairVolumes( final KojiRepairRequest request, final @Context HttpServletRequest servletRequest,
                                    final @Context SecurityContext securityContext, final @Context UriInfo uriInfo );

    @POST
    @Path( "/mask" )
    @Consumes( APPLICATION_JSON )
    KojiRepairResult repairPathMasks( final KojiRepairRequest request, final @Context HttpServletRequest servletRequest,
                                      final @Context SecurityContext securityContext, final @Context UriInfo uriInfo );

    @POST
    @Path( "mask/all" )
    @Consumes( APPLICATION_JSON )
    KojiMultiRepairResult repairAllPathMasks( final @Context HttpServletRequest servletRequest,
                                              final @Context SecurityContext securityContext,
                                              final @Context UriInfo uriInfo );

    @POST
    @Path( "metadata/timeout" )
    @Consumes( APPLICATION_JSON )
    KojiRepairResult repairMetadataTimeout( final KojiRepairRequest request,
                                            final @Context HttpServletRequest servletRequest,
                                            final @Context SecurityContext securityContext );

    @POST
    @Path( "metadata/timeout/all" )
    @Consumes( APPLICATION_JSON )
    KojiMultiRepairResult repairAllMetadataTimeout( final @Context HttpServletRequest servletRequest,
                                                    final @QueryParam( "isDryRun" ) Boolean isDryRun,
                                                    final @Context SecurityContext securityContext );

}
