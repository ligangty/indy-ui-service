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
package org.commonjava.indy.service.ui.jaxrs.nfc;

import org.commonjava.indy.service.ui.client.nfc.NFCServiceClient;
import org.commonjava.indy.service.ui.models.nfc.NotFoundCacheDTO;
import org.commonjava.indy.service.ui.models.nfc.NotFoundCacheInfoDTO;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.parameters.Parameter;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import javax.inject.Inject;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.eclipse.microprofile.openapi.annotations.enums.ParameterIn.PATH;

@Tag( description = "REST resource that manages the not-found cache", name = "Not-Found Cache" )
@Path( "/api/nfc" )
public class NfcResource
{
    @Inject
    @RestClient
    NFCServiceClient client;

    @Operation( description = "Clear all not-found cache entries" )
    @DELETE
    public Response clearAll()
    {
        return client.clearAll();
    }

    @Operation(
            description = "[Deprecated] Clear all not-found cache entries for a particular store (or optionally, a subpath within a store)" )
    @Path( "/{type: (hosted|group|remote)}/{name}{path: (/.+)?}" )
    @DELETE
    @Deprecated
    public Response deprecatedClearStore(
            final @Parameter( name = "type", required = true, in = PATH, description = "The type of store" )
            @PathParam( "type" ) String t,
            final @Parameter( name = "name", required = true, in = PATH, description = "The name of the store" )
            @PathParam( "name" ) String name,
            final @Parameter( name = "path", in = PATH, description = "The sub-path to clear" )
            @PathParam( "path" ) String p )
    {

        return client.deprecatedClearStore( t, name, p );
    }

    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}{path: (/.+)?}" )
    @Operation(
            description = "Clear all not-found cache entries for a particular store (or optionally, a subpath within a store)" )
    @DELETE
    public Response clearStore( final @Parameter( name = "packageType", required = true, in = PATH,
                                                  description = "The type of package (eg. maven, npm, generic-http)" )
                                @PathParam( "packageType" ) String packageType,
                                final @Parameter( name = "type", in = PATH, required = true,
                                                  description = "The type of store" ) @PathParam( "type" ) String t,
                                final @Parameter( name = "name", required = true, in = PATH,
                                                  description = "The name of the store" )
                                @PathParam( "name" ) String name,
                                final @Parameter( name = "path", description = "The sub-path to clear" )
                                @PathParam( "path" ) String p )
    {
        return client.clearStore( packageType, t, name, p );
    }

    @Operation( description = "Retrieve all not-found cache entries currently tracked" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = NotFoundCacheDTO.class ) ),
                  description = "The full not-found cache" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAll( final @Parameter( name = "pageIndex", description = "page index" )
                            @QueryParam( "pageIndex" ) Integer pageIndex,
                            final @Parameter( name = "pageSize", description = "page size" )
                            @QueryParam( "pageSize" ) Integer pageSize )
    {
        return client.getAll( pageIndex, pageSize );
    }

    @Operation( description = "Get not-found cache information, e.g., size, etc" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = NotFoundCacheInfoDTO.class ) ),
                  description = "The info of not-found cache" )
    @GET
    @Path( "/info" )
    @Produces( APPLICATION_JSON )
    public Response getInfo()
    {
        return client.getInfo();
    }

    @Operation( description = "[Deprecated] Retrieve all not-found cache entries currently tracked for a given store" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = NotFoundCacheDTO.class ) ),
                  description = "The not-found cache for the specified artifact store" )
    @Path( "/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    @Deprecated
    public Response deprecatedGetStore(
            final @Parameter( name = "type", required = true, description = "The type of store" )
            @PathParam( "type" ) String t,
            final @Parameter( name = "name", description = "The name of the store" ) @PathParam( "name" ) String name,
            final @Parameter( name = "pageIndex", description = "page index" )
            @QueryParam( "pageIndex" ) Integer pageIndex,
            final @Parameter( name = "pageSize", description = "page size" )
            @QueryParam( "pageSize" ) Integer pageSize )
    {
        return client.deprecatedGetStore( t, name, pageIndex, pageSize );
    }

    @Operation( description = "Get not-found cache information, e.g., size, etc" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = NotFoundCacheInfoDTO.class ) ),
                  description = "The info of not-found cache" )
    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}/info" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getStoreInfo( final @Parameter( name = "packageType", required = true,
                                                    description = "type of package (eg. maven, npm, generic-http)" )
                                  @PathParam( "packageType" ) String packageType,
                                  final @Parameter( name = "type", required = true, description = "type of store" )
                                  @PathParam( "type" ) String t,
                                  final @Parameter( name = "name", description = "name of the store" )
                                  @PathParam( "name" ) String name )
    {
        return client.getStoreInfo( packageType, t, name );
    }

    @Operation( description = "Retrieve all not-found cache entries currently tracked for a given store" )
    @APIResponse( responseCode = "200",
                  content = @Content( schema = @Schema( implementation = NotFoundCacheDTO.class ) ),
                  description = "The not-found cache for the specified artifact store" )
    @Path( "/{packageType}/{type: (hosted|group|remote)}/{name}" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getStore( final @Parameter( name = "packageType", required = true,
                                                description = "type of package (eg. maven, npm, generic-http)" )
                              @PathParam( "packageType" ) String packageType,
                              final @Parameter( name = "type", required = true, description = "type of store" )
                              @PathParam( "type" ) String t,
                              final @Parameter( name = "name", description = "name of the store" )
                              @PathParam( "name" ) String name,
                              final @Parameter( name = "pageIndex", description = "page index" )
                              @QueryParam( "pageIndex" ) Integer pageIndex,
                              final @Parameter( name = "pageSize", description = "page size" )
                              @QueryParam( "pageSize" ) Integer pageSize )
    {
        return client.getStore( packageType, t, name, pageIndex, pageSize );
    }
}
