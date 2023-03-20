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
package org.commonjava.indy.service.ui.controller;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.plexus.interpolation.InterpolationException;
import org.codehaus.plexus.interpolation.PropertiesBasedValueSource;
import org.codehaus.plexus.interpolation.StringSearchInterpolator;
import org.commonjava.indy.service.ui.util.UrlUtils;
import org.commonjava.indy.service.ui.conf.KeycloakConfig;
import org.commonjava.indy.service.ui.exception.IndyUIException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.util.Properties;

/**
 * @deprecated Will use quarkus oidc plugin to support keycloak sso
 */
@SuppressWarnings( "unused" )
@ApplicationScoped
@Deprecated
public class SecurityController
{

    private static final String KEYCLOAK_INIT_JS = "keycloak-init.js";

    private static final String DISABLED_KEYCLOAK_INIT_JS = "disabled-keycloak-init.js";

    @Inject
    KeycloakConfig config;

    private String keycloakInitJs;

    private String keycloakUiJson;

    protected SecurityController()
    {
    }

    public SecurityController( final KeycloakConfig config )
    {
        this.config = config;
    }

    public synchronized String getKeycloakInit()
            throws IndyUIException
    {
        if ( keycloakInitJs == null )
        {
            if ( !config.isEnabled() )
            {
                keycloakInitJs = loadClasspathContent( DISABLED_KEYCLOAK_INIT_JS );
            }
            else
            {
                final String raw = loadClasspathContent( KEYCLOAK_INIT_JS );

                try
                {
                    keycloakInitJs = getInterpolator().interpolate( raw );
                }
                catch ( final InterpolationException e )
                {
                    throw new IndyUIException( "Failed to resolve expressions in keycloak-ui.json: %s", e,
                                               e.getMessage() );
                }
            }
        }

        return keycloakInitJs;
    }

    private StringSearchInterpolator getInterpolator()
    {
        final Properties props = new Properties();
        config.realm().ifPresent( e -> props.setProperty( KeycloakConfig.KEYCLOAK_REALM, e ) );
        config.url().ifPresent( e -> props.setProperty( KeycloakConfig.KEYCLOAK_URL, e ) );
        config.uiResource().ifPresent( e -> props.setProperty( KeycloakConfig.KEYCLOAK_UI_RESOURCE, e ) );
        config.realmPublicKey().ifPresent( e -> props.setProperty( KeycloakConfig.KEYCLOAK_REALM_PUBLIC_KEY, e ) );

        final StringSearchInterpolator interpolator = new StringSearchInterpolator();
        interpolator.addValueSource( new PropertiesBasedValueSource( props ) );

        return interpolator;
    }

    public String getKeycloakJs()
            throws IndyUIException
    {
        if ( !config.isEnabled() )
        {
            return null;
        }

        try
        {
            return UrlUtils.buildUrl( config.url().orElse( "" ), "/js/keycloak.js" );
        }
        catch ( final MalformedURLException e )
        {
            throw new IndyUIException( "Keycloak URL is invalid: %s", e, config.url() );
        }
    }

    public synchronized String getKeycloakUiJson()
            throws IndyUIException
    {
        if ( !config.isEnabled() )
        {
            return null;
        }

        if ( keycloakUiJson == null )
        {
            String raw = loadFileContent( config.keycloakUiJson().orElse( "" ) );
            if ( StringUtils.isEmpty( raw ) )
            {
                raw = loadClasspathContent( "keycloak.json" );
            }
            try
            {
                keycloakUiJson = getInterpolator().interpolate( raw );
            }
            catch ( final InterpolationException e )
            {
                throw new IndyUIException( "Failed to resolve expressions in keycloak-ui.json: %s", e, e.getMessage() );
            }
        }

        return keycloakUiJson;
    }

    private String loadFileContent( final String path )
            throws IndyUIException
    {
        final File f = new File( path );
        if ( !f.exists() )
        {
            throw new IndyUIException( "Path: %s does not exist!", path );
        }

        try
        {
            return FileUtils.readFileToString( f );
        }
        catch ( final IOException e )
        {
            throw new IndyUIException( "Cannot read path: %s. Reason: %s", e, path, e.getMessage() );
        }
    }

    private String loadClasspathContent( final String jsFile )
            throws IndyUIException
    {
        try (InputStream jsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream( jsFile ))
        {
            if ( jsStream == null )
            {
                throw new IndyUIException( "Failed to load javascript from classpath: %s. Resource not found.",
                                           jsFile );
            }

            return IOUtils.toString( jsStream );
        }
        catch ( final IOException e )
        {
            throw new IndyUIException( "Failed to read javascript from classpath: %s. Reason: %s.", e, jsFile,
                                       e.getMessage() );
        }
    }

}

