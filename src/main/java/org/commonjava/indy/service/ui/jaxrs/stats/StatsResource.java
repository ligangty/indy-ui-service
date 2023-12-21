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
package org.commonjava.indy.service.ui.jaxrs.stats;

import io.quarkus.runtime.LaunchMode;
import org.commonjava.indy.service.ui.client.stats.StatsClient;
import org.commonjava.indy.service.ui.exception.IndyUIException;
import org.commonjava.indy.service.ui.jaxrs.ResponseHelper;
import org.commonjava.indy.service.ui.models.stats.AddOnListing;
import org.commonjava.indy.service.ui.models.stats.EndpointView;
import org.commonjava.indy.service.ui.models.stats.IndyVersioning;
import org.eclipse.microprofile.openapi.annotations.Operation;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.tags.Tag;
import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.util.Map;

import static javax.ws.rs.core.MediaType.APPLICATION_JSON;
import static org.commonjava.indy.service.ui.util.ResourceUtils.loadClasspathContent;

@Tag( description = "Various read-only operations for retrieving information about the system.",
      name = "Generic Infrastructure Queries (UI Support)" )
@Path( "/api/stats" )
public class StatsResource
{
    private final Logger logger = LoggerFactory.getLogger( this.getClass() );

    @Inject
    @RestClient
    StatsClient client;

    @Inject
    ResponseHelper responseHelper;

    @Operation(
            description = "Aggregate javascript content for all add-ons and format as a single Javascript stream (this gives the UI a static URL to load add-on logic)" )
    @APIResponse( responseCode = "200", description = "The add-on Javascript wrapped as a JSON object" )
    @Path( "/addons/active.js" )
    @GET
    @Produces( "application/javascript" )
    public Response getAddonInjectionJavascript()
    {
        try
        {
            String activeJs = client.getAddonInjectionJavascript();
            logger.trace( "Active.js content from service api: {}", activeJs );
            return responseHelper.formatOkResponseWithEntity( activeJs, "application/javascript" );
        }
        catch ( Exception e )
        {
            if ( LaunchMode.current() == LaunchMode.NORMAL )
            {
                return responseHelper.formatResponse( e );
            }
            else
            {
                return debugActiveJs();
            }
        }

    }

    /**
     * This is used for local development or testing.
     */
    private Response debugActiveJs()
    {
        try
        {
            return responseHelper.formatOkResponseWithEntity( loadClasspathContent( "debug-active.js" ),
                                                              "application/javascript" );
        }
        catch ( IndyUIException e )
        {
            return responseHelper.formatResponse( e );
        }
    }

    @Operation( description = "Retrieve JSON describing the add-ons that are available on the system" )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = AddOnListing.class ) ),
                  description = "The description object" )
    @Path( "/addons/active" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAddonList()
    {
        return client.getAddonList();
    }

    @Operation( description = "Retrieve versioning information about this Indy instance" )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = IndyVersioning.class ) ),
                  description = "The version metadata" )
    @Path( "/version-info" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getIndyVersion()
    {
        return client.getIndyVersion();
    }

    @Operation(
            description = "Retrieve a mapping of the package type names to descriptors (eg. maven, npm, generic-http, etc) available on the system." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = Map.class ) ),
                  description = "The package type listing of packageType => details" )
    @Path( "/package-type/map" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getPackageTypeMap()
    {
        return client.getPackageTypeMap();
    }

    @Operation(
            description = "Retrieve a list of the package type names (eg. maven, npm, generic-http, etc) available on the system." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = Map.class ) ),
                  description = "The package type listing" )
    @Path( "/package-type/keys" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getPackageTypeNames()
    {
        return client.getPackageTypeNames();
    }

    @Operation( description = "Retrieve a listing of the artifact stores available on the system. "
            + "This is especially useful for setting up a network of Indy instances that reference one another."
            + "Note: this method is deprecated as repository management is moved to standalone repository service." )
    @APIResponse( responseCode = "200", content = @Content( schema = @Schema( implementation = EndpointView.class ) ),
                  description = "The artifact store listing" )
    @Path( "/all-endpoints" )
    @GET
    @Produces( APPLICATION_JSON )
    public Response getAllEndpoints( @Context final UriInfo uriInfo )
    {
        return client.getAllEndpoints( uriInfo );
    }
}
