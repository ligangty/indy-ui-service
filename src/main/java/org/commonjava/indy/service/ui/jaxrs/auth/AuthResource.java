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

import org.eclipse.microprofile.jwt.JsonWebToken;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;
import java.net.URI;

@Path( "/api/admin/auth" )
public class AuthResource
{
    @Inject
    JsonWebToken accessToken;

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
}
