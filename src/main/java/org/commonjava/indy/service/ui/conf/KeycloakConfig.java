package org.commonjava.indy.service.ui.conf;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
@ConfigMapping( prefix = "keycloak" )
public interface KeycloakConfig
{
    String KEYCLOAK_REALM = "keycloak.realm";

    String KEYCLOAK_URL = "keycloak.url";

    String KEYCLOAK_SERVER_RESOURCE = "keycloak.serverResource";

    String KEYCLOAK_UI_RESOURCE = "keycloak.uiResource";

    String KEYCLOAK_SERVER_CREDENTIAL_SECRET = "keycloak.serverCredentialSecret";

    String KEYCLOAK_REALM_PUBLIC_KEY = "keycloak.realmPublicKey";

    @WithName( "enabled" )
    @WithDefault( "false" )
    boolean isEnabled();

    @WithName( "uiResource" )
    Optional<String> uiResource();

    @WithName( "serverResource" )
    Optional<String> serverResource();

    @WithName( "realmPublicKey" )
    Optional<String> realmPublicKey();

    @WithName( "uiJson" )
    Optional<String> keycloakUiJson();

    @WithName( "realm" )
    Optional<String> realm();

    @WithName( "url" )
    Optional<String> url();
}
