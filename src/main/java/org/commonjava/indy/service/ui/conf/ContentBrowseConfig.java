package org.commonjava.indy.service.ui.conf;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;
import io.smallrye.config.WithName;

import javax.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
@ConfigMapping( prefix = "content-browse" )
public interface ContentBrowseConfig
{
    @WithName( "enabled" )
    @WithDefault( "true" )
    Boolean enabled();

    @WithName( "service-url" )
    Optional<String> serviceUrl();

    @WithName( "resource-root" )
    @WithDefault( "META-INF/webui/content-browse/" )
    String resourceRoot();
}
