/**
 * Copyright (C) 2011-2022 Red Hat, Inc. (https://github.com/Commonjava/indy)
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
package org.commonjava.indy.service.client.koji;

import org.commonjava.indy.service.models.koji.KojiMultiRepairResult;
import org.commonjava.indy.service.models.koji.KojiRepairRequest;
import org.commonjava.indy.service.models.koji.KojiRepairResult;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.UriInfo;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;

@Path( "/api/repair/koji" )
@Produces( APPLICATION_JSON )
@RegisterRestClient( configKey = "service-api" )
//@RegisterProvider( CustomClientRequestFilter.class)
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
