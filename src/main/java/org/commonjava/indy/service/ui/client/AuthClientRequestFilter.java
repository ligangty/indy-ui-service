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
package org.commonjava.indy.service.ui.client;

import io.quarkus.oidc.IdToken;
import io.quarkus.oidc.RefreshToken;
import org.apache.commons.lang3.StringUtils;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Priority;
import javax.inject.Inject;
import javax.ws.rs.Priorities;
import javax.ws.rs.client.ClientRequestContext;
import javax.ws.rs.client.ClientRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.ext.Provider;

//@Provider
//@Priority( Priorities.AUTHENTICATION )
public class AuthClientRequestFilter
        implements ClientRequestFilter
{
    private final Logger logger = LoggerFactory.getLogger( this.getClass() );

//    @Inject
//    @IdToken
//    JsonWebToken idToken;

    @Inject
    JsonWebToken accessToken;

//    @Inject
//    RefreshToken refreshToken;

    @Override
    public void filter( ClientRequestContext requestContext )
    {
//        if ( idToken != null )
//        {
//            Object userName = this.idToken.getClaim( "preferred_username" );
//            logger.debug( "User: {}", userName );
//        }
        if ( accessToken != null && StringUtils.isNotBlank( accessToken.getRawToken() ) )
        {
            final String accToken = accessToken.getRawToken();
            logger.trace( "User {}, access token in authenticate header: {}", accessToken.getName(), accToken );
            requestContext.getHeaders()
                          .add( HttpHeaders.AUTHORIZATION, String.format( "Bearer %s", accToken ) );
        }
    }
}
