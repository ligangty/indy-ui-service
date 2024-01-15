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
package org.commonjava.indy.service.ui.jaxrs.auth;

import io.quarkus.security.identity.SecurityIdentity;
import org.apache.commons.lang3.StringUtils;
import org.commonjava.indy.service.ui.models.auth.UserInfo;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.eclipse.microprofile.openapi.annotations.responses.APIResponses;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.net.URI;
import java.security.Principal;
import java.util.Collections;
import java.util.Set;

@Path( "/api/admin/auth" )
public class AuthResource
{
    private final Logger logger = LoggerFactory.getLogger( this.getClass() );

    @Inject
    JsonWebToken accessToken;

    @Inject
    SecurityIdentity identity;

    @Path( "accesstoken" )
    @GET
    @Produces( MediaType.TEXT_HTML )
    public Response getAccessToken( @Context UriInfo uriInfo )
    {
        final StringBuilder contentBuilder = new StringBuilder();
        final String accToken = accessToken.getRawToken();
        final URI uri = uriInfo.getBaseUriBuilder().path( "/api/*" ).build();

        contentBuilder.append( "<html lang=\"en\">\n" )
                      .append( "  <head>\n" )
                      .append( "    <meta charset=\"utf-8\">\n" )
                      .append( "    <title>Indy Token</title>\n" )
                      .append( "  </head>\n" )
                      .append( "  <body>\n" )
                      .append( "    <h2>Your access token is:</h2>\n" )
                      .append( String.format( "    <code>%s</code>\n", accToken ) )
                      .append( "    <h3>Use this token directly against the API</h3>\n" )
                      .append( String.format( "     <pre>curl -H \"Authorization: Bearer %s\" \"%s\"</pre>\n", accToken,
                                              uri.toString() ) )
                      .append( "  </body>\n" )
                      .append( "</html>" );
        return Response.ok( contentBuilder.toString() ).build();
    }

    @APIResponses( { @APIResponse( responseCode = "200",
                                   content = @Content( schema = @Schema( implementation = UserInfo.class ) ),
                                   description = "Return the current user information" ),
            @APIResponse( responseCode = "401", description = "User not authenticated" ) } )
    @Path( "userinfo" )
    @GET
    @Produces( MediaType.APPLICATION_JSON )
    public Response getUserInfo( @Context UriInfo uriInfo )
    {
        Set<String> roles = identity.getRoles() == null ? Collections.emptySet() : identity.getRoles();
        Principal user = identity.getPrincipal();
        if ( user != null && StringUtils.isNotBlank( user.getName() ) )
        {
            logger.debug( "User: {}", user.getName() );
            final UserInfo userInfo = new UserInfo( user.getName(), roles );
            return Response.ok( userInfo ).build();
        }
        else
        {
            logger.warn( "User name is not got correctly, please check the security configuration." );
            return Response.status( Response.Status.UNAUTHORIZED ).build();
        }
    }
}
