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
package org.commonjava.indy.service.ui.jaxrs.tracking;

import org.commonjava.indy.service.ui.client.tracking.FoloAdminClient;
import org.commonjava.indy.service.ui.models.admin.BatchDeleteRequest;
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
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.UriInfo;
import java.io.File;
import java.util.List;

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.commonjava.indy.service.ui.client.tracking.FoloAdminClient.MEDIATYPE_APPLICATION_ZIP;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( name = "Tracking Record Access", description = "Manages tracking records." )
@Path( "/api/folo/admin" )
public class FoloAdminResource
{

    @Inject
    @RestClient
    FoloAdminClient client;

    @Operation( description = "Recalculate sizes and checksums for every file listed in a tracking record." )
    @APIResponse( responseCode = "200", description = "Recalculated tracking report" )
    @APIResponse( responseCode = "404", description = "No such tracking record found" )
    @Path( "/{id}/record/recalculate" )
    @GET
    public Response recalculateRecord(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id, @Context final UriInfo uriInfo )
    {
        return client.recalculateRecord( id, uriInfo );
    }

    @Operation(
            description = "Retrieve the content referenced in a tracking record as a ZIP-compressed Maven repository directory." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = File.class ) ),
                  description = "ZIP repository content" )
    @APIResponse( responseCode = "404", description = "No such tracking record" )
    @Path( "/{id}/record/zip" )
    @GET
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    public File getZipRepository(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id )
    {
        return client.getZipRepository( id );
    }

    @Operation( description = "Alias of /{id}/record, returns the tracking record for the specified key" )
    @APIResponse( responseCode = "200", description = "Tracking record" )
    @APIResponse( responseCode = "404", description = "No such tracking record" )
    @Path( "/{id}/report" )
    @GET
    public Response getReport(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id, @Context final UriInfo uriInfo )
    {
        return client.getRecord( id, uriInfo );
    }

    @Operation(
            description = "Explicitly setup a new tracking record for the specified key, to prevent 404 if the record is never used." )
    @APIResponse( responseCode = "201", description = "Tracking record was created" )
    @Path( "/{id}/record" )
    @PUT
    public Response initRecord(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id, @Context final UriInfo uriInfo )
    {

        return client.initRecord( id, uriInfo );
    }

    @Operation( description = "Store record for single tracking content artifact" )
    @APIResponse( responseCode = "201", description = "Store tracking entry" )
    @Path( "/report/recordArtifact" )
    @PUT
    public Response recordArtifact( final @Context UriInfo uriInfo, final @Context HttpServletRequest request )
    {
        return client.recordArtifact( uriInfo, request );
    }

    @Operation( description = "Seal the tracking record for the specified key, to prevent further content logging" )
    @APIResponse( responseCode = "200", description = "Tracking record" )
    @APIResponse( responseCode = "404", description = "No such tracking record" )
    @Path( "/{id}/record" )
    @POST
    public Response sealRecord(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id, @Context final UriInfo uriInfo )
    {
        return client.sealRecord( id, uriInfo );
    }

    @Operation( description = "Alias of /{id}/record, returns the tracking record for the specified key" )
    @APIResponse( responseCode = "200", description = "Tracking record" )
    @APIResponse( responseCode = "404", description = "No such tracking record" )
    @Path( "/{id}/record" )
    @GET
    public Response getRecord(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id, @Context final UriInfo uriInfo )
    {
        return client.getRecord( id, uriInfo );
    }

    @Operation( description = "Delete the tracking record for the specified key" )
    @Path( "/{id}/record" )
    @DELETE
    public Response clearRecord(
            @Parameter( description = "User-assigned tracking session key", in = PATH, required = true )
            @PathParam( "id" ) final String id )
    {
        return client.clearRecord( id );
    }

    @Operation( description = "Retrieve tracking ids for records of given type." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = List.class ) ),
                  description = "tracking ids with sealed or in_progress" )
    @APIResponse( responseCode = "404", description = "No ids found for type" )
    @Path( "/report/ids/{type}" )
    @GET
    public Response getRecordIds(
            @Parameter( description = "Report type, should be in_progress|sealed|all|legacy", in = PATH,
                        required = true ) @PathParam( "type" ) final String type )
    {
        return client.getRecordIds( type );
    }

    @Operation( description = "Export the records as a ZIP file." )
    @APIResponse( responseCode = "200", description = "ZIP content" )
    @Path( "/report/export" )
    @GET
    @Produces( MEDIATYPE_APPLICATION_ZIP )
    public File exportReport()
    {
        return client.exportReport();
    }

    @Operation( description = "Import records from a ZIP file." )
    @APIResponse( responseCode = "201", description = "Import ZIP content" )
    @Path( "/report/import" )
    @PUT
    public Response importReport( final @Context UriInfo uriInfo, final @Context HttpServletRequest request )
    {
        return client.importReport( uriInfo, request );
    }

    @Operation( description = "Batch delete files uploaded through FOLO trackingID under the given storeKey." )
    @APIResponse( responseCode = "200", description = "Batch delete operation finished." )
    @RequestBody( description = "JSON object, specifying trackingID and storeKey, with other configuration options",
                  name = "body", required = true )
    @Path( "/batch/delete" )
    @POST
    @Consumes( APPLICATION_JSON )
    @Produces( APPLICATION_JSON )
    public Response doDelete( @Context final UriInfo uriInfo, final BatchDeleteRequest request )
    {
        return client.doDelete( uriInfo, request );
    }
}
