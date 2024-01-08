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
package org.commonjava.indy.service.ui.jaxrs.admin;

import org.commonjava.indy.service.ui.client.admin.MaintenanceServiceClient;
import org.commonjava.indy.service.ui.models.admin.BatchDeleteRequest;
import org.commonjava.indy.service.ui.models.repository.StoreType;
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

import static jakarta.ws.rs.core.MediaType.APPLICATION_JSON;

@Tag( name = "Maintenance", description = "Basic repository maintenance functions" )
@Path( "/api/admin/maint" )
public class MaintenanceResource
{
    @Inject
    @RestClient
    MaintenanceServiceClient client;

    @Operation(
            description = "[Deprecated] Rescan all content in the specified repository to re-initialize metadata, capture missing index keys, etc." )
    @APIResponse( responseCode = "200",
                  description = "Rescan was started successfully. (NOTE: There currently is no way to determine when rescanning is complete.)" )
    @Path( "/rescan/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Deprecated
    public Response deprecatedRescan( @Parameter( description = "The type of store / repository", content = @Content(
            schema = @Schema( implementation = StoreType.class ) ), required = true ) final @PathParam(
            "type" ) String type, @Parameter( description = "The name of the store / repository" ) @PathParam( "name" )
                                      final String name )
    {
        return client.deprecatedRescan( type, name );
    }

    @Operation(
            description = "Rescan all content in the specified repository to re-initialize metadata, capture missing index keys, etc." )
    @APIResponse( responseCode = "200",
                  description = "Rescan was started successfully. (NOTE: There currently is no way to determine when rescanning is complete.)" )
    @Path( "/rescan/{packageType}/{type: (hosted|group|remote)}/{name}" )
    @GET
    public Response rescan(
            @Parameter( description = "The package type (eg. maven, npm, generic-http)", required = true )
            @PathParam( "packageType" ) final String packageType,
            @Parameter( description = "The type of store / repository",
                        content = @Content( schema = @Schema( implementation = StoreType.class ) ), required = true )
            final @PathParam( "type" ) String type,
            @Parameter( description = "The name of the store / repository" ) @PathParam( "name" ) final String name )
    {
        return client.rescan( packageType, type, name );
    }

    @Operation(
            description = "Rescan all content in all repositories to re-initialize metadata, capture missing index keys, etc." )
    @APIResponse( responseCode = "200",
                  description = "Rescan was started successfully. (NOTE: There currently is no way to determine when rescanning is complete.)" )
    @Path( "/rescan/all" )
    @GET
    public Response rescanAll()
    {
        return client.rescanAll();
    }

    @Deprecated
    @Operation( description = "Delete the specified path globally (from any repository that contains it)." )
    @APIResponse( responseCode = "200", description = "Global deletion complete for path." )
    @Path( "/delete/all{path: (/.+)?}" )
    @DELETE
    public Response deleteAllViaGet(
            @Parameter( description = "The path to delete globally" ) final @PathParam( "path" ) String path )
    {
        return client.deleteAllViaGet( path );
    }

    @Operation( description = "Delete the specified path globally (from any repository that contains it)." )
    @APIResponse( responseCode = "200", description = "Global deletion complete for path." )
    @Path( "/content/all{path: (/.+)?}" )
    @DELETE
    public Response deleteAll(
            @Parameter( description = "The path to delete globally" ) final @PathParam( "path" ) String path )
    {
        return client.deleteAll( path );
    }

    @Operation( description = "Clean the specified Infinispan cache." )
    @APIResponse( responseCode = "200", description = "Clean complete." )
    @Path( "/infinispan/cache/{name}" )
    @DELETE
    public Response cleanInfinispanCache(
            @Parameter( description = "The name of cache to clean" ) @PathParam( "name" ) final String name )
    {
        return client.cleanInfinispanCache( name );
    }

    @Operation( description = "Export the specified Infinispan cache." )
    @APIResponse( responseCode = "200", description = "Export complete." )
    @Produces( "application/json" )
    @Path( "/infinispan/cache/{name}{key: (/.+)?}" )
    @GET
    public Response exportInfinispanCache(
            @Parameter( description = "The name of cache to export" ) @PathParam( "name" ) final String name,
            @Parameter( description = "The cache key" ) @PathParam( "key" ) final String key )
    {
        return client.exportInfinispanCache( name, key );
    }

    @Operation( description = "Get groups affected by specified repo." )
    @APIResponse( responseCode = "200", description = "Complete." )
    @Produces( "application/json" )
    @Path( "/store/affected/{key}" )
    @GET
    public Response affectedBy( @Parameter( description = "The store key" ) @PathParam( "key" ) final String key )
    {
        return client.affectedBy( key );
    }

    @Operation( description = "Get tombstone stores that have no content and not in any group." )
    @APIResponse( responseCode = "200", description = "Complete." )
    @Produces( APPLICATION_JSON )
    @Path( "/stores/tombstone/{packageType}/hosted" )
    @GET
    public Response getTombstoneStores(
            @Parameter( description = "The packageType" ) @PathParam( "packageType" ) final String packageType )
    {
        return client.getTombstoneStores( packageType );
    }

    @Operation( description = "Batch delete files under the given package store (type/name) and paths." )
    @APIResponse( responseCode = "200", description = "Batch delete operation finished." )
    @RequestBody( name = "body",
                  description = "JSON object, specifying storeKey and paths, the option trackingID is not supported in this API.",
                  required = true, content = @Content( schema = @Schema( implementation = BatchDeleteRequest.class ) ) )
    @Path( "/content/batch/delete" )
    @POST
    public Response doDelete( final BatchDeleteRequest request )
    {
        return client.doDelete( request );
    }

    @Operation( description = "Import artifact stores from a ZIP file." )
    @APIResponse( responseCode = "201", description = "Import ZIP content" )
    @Path( "/store/import" )
    @PUT
    public Response importStore( final @Context UriInfo uriInfo, final @Context HttpServletRequest request )
    {
        return client.importStore( uriInfo, request );
    }
}
