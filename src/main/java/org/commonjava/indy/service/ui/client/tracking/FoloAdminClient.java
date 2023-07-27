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
package org.commonjava.indy.service.ui.client.tracking;

import org.commonjava.indy.service.ui.models.admin.BatchDeleteRequest;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.io.File;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Path( "/api/folo/admin" )
@RegisterRestClient( configKey = "service-api" )
public interface FoloAdminClient
{
    String MEDIATYPE_APPLICATION_ZIP = "application/zip";

    @Path( "/{id}/record/recalculate" )
    @GET
    Response recalculateRecord( @PathParam( "id" ) final String id, @Context final UriInfo uriInfo );

    @Path( "/{id}/record/zip" )
    @GET
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    File getZipRepository( @PathParam( "id" ) final String id );

    @Path( "/{id}/report" )
    @GET
    Response getReport( @PathParam( "id" ) final String id, @Context final UriInfo uriInfo );

    @Path( "/{id}/record" )
    @PUT
    Response initRecord( @PathParam( "id" ) final String id, @Context final UriInfo uriInfo );

    @Operation( description = "Store record for single tracking content artifact" )
    @Path( "/report/recordArtifact" )
    @PUT
    Response recordArtifact( final @Context UriInfo uriInfo, final @Context HttpServletRequest request );

    @Operation( description = "Seal the tracking record for the specified key, to prevent further content logging" )
    @APIResponse( responseCode = "200", description = "Tracking record" )
    @APIResponse( responseCode = "404", description = "No such tracking record" )
    @Path( "/{id}/record" )
    @POST
    Response sealRecord( @PathParam( "id" ) final String id, @Context final UriInfo uriInfo );

    @Path( "/{id}/record" )
    @GET
    Response getRecord( @PathParam( "id" ) final String id, @Context final UriInfo uriInfo );

    @Path( "/{id}/record" )
    @DELETE
    Response clearRecord( @PathParam( "id" ) final String id );

    @Path( "/report/ids/{type}" )
    @GET
    Response getRecordIds( @Parameter( description = "Report type, should be in_progress|sealed|all|legacy", in = PATH,
                                       required = true ) @PathParam( "type" ) final String type );

    @Operation( description = "Export the records as a ZIP file." )
    @APIResponse( responseCode = "200", description = "ZIP content" )
    @Path( "/report/export" )
    @GET
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    File exportReport();

    @Path( "/report/import" )
    @PUT
    Response importReport( final @Context UriInfo uriInfo, final @Context HttpServletRequest request );

    @Path( "/batch/delete" )
    @POST
    @Consumes( APPLICATION_JSON )
    @Produces( APPLICATION_JSON )
    Response doDelete( @Context final UriInfo uriInfo, final BatchDeleteRequest request );
}
