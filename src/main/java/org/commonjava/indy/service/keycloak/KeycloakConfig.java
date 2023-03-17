/**
 * Copyright (C) 2023 Red Hat, Inc.
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
package org.commonjava.indy.service.keycloak;

import io.quarkus.runtime.Startup;
import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;
import java.util.Properties;

@Startup
@ConfigMapping( prefix = "keycloak" )
@ApplicationScoped
interface KeycloakConfig
{
    boolean DEFAULT_ENABLED = false;

    String DEFAULT_REALM = "indy";

    String DEFAULT_KEYCLOAK_JSON = "keycloak/keycloak.json";

    String DEFAULT_KEYCLOAK_UI_JSON = "keycloak/keycloak-ui.json";

    String DEFAULT_SECURITY_BINDINGS_JSON = "keycloak/security-bindings.json";

    String DEFAULT_SERVER_RESOURCE = "indy";

    String DEFAULT_UI_RESOURCE = "indy-ui";

    String DEFAULT_URL = "http://localhost:8090";

    String KEYCLOAK_REALM = "keycloak.realm";

    String KEYCLOAK_URL = "keycloak.url";

    String KEYCLOAK_SERVER_RESOURCE = "keycloak.serverResource";

    String KEYCLOAK_UI_RESOURCE = "keycloak.uiResource";

    String KEYCLOAK_SERVER_CREDENTIAL_SECRET = "keycloak.serverCredentialSecret";

    String KEYCLOAK_REALM__KEY = "keycloak.realmKey";

    String KEYCLOAK_REALM_PUBLIC_KEY = "keycloak.realmPublicKey";

    @WithName( "enabled" )
    @WithDefault( "false" )
    Boolean enabled();

    @WithName( "realm.name" )
    @WithDefault( DEFAULT_REALM )
    String getRealm();

    @WithName( "keycloak.json" )
    @WithDefault( DEFAULT_KEYCLOAK_JSON )
    String getKeycloakJson();

    @WithName( "keycloak-ui.json" )
    @WithDefault( DEFAULT_KEYCLOAK_UI_JSON )
    String getKeycloakUiJson();

    @WithName( "security-bindings.json" )
    @WithDefault( DEFAULT_SECURITY_BINDINGS_JSON )
    String getSecurityBindingsJson();

    @WithName( "url" )
    @WithDefault( DEFAULT_URL )
    String getUrl();

    @WithName( "server.credential.secret" )
    Optional<String> getServerCredentialSecret();

    @WithName( "server.resource" )
    @WithDefault( DEFAULT_SERVER_RESOURCE )
    String getServerResource();

    @WithName( "ui.resource" )
    @WithDefault( DEFAULT_UI_RESOURCE )
    String getUiResource();

    @WithName( "realm.key" )
    Optional<String> getRealmKey();

    @WithName( "realm.public.key" )
    Optional<String> getRealmPublicKey();

    default KeycloakConfig setSystemProperties()
    {
        if ( !enabled() )
        {
            return this;
        }

        final Properties properties = System.getProperties();
        properties.setProperty( KEYCLOAK_REALM, getRealm() );
        properties.setProperty( KEYCLOAK_URL, getUrl() );

        if ( getServerResource() != null )
        {
            properties.setProperty( KEYCLOAK_SERVER_RESOURCE, getServerResource() );
        }

        if ( getServerCredentialSecret().isPresent() )
        {
            properties.setProperty( KEYCLOAK_SERVER_CREDENTIAL_SECRET, getServerCredentialSecret().get() );
        }

        if ( getRealmPublicKey().isPresent() )
        {
            properties.setProperty( KEYCLOAK_REALM_PUBLIC_KEY, getRealmPublicKey().get() );
        }

        System.setProperties( properties );

        return this;
    }
}
