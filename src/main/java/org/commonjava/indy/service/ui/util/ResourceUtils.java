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
package org.commonjava.indy.service.ui.util;

import org.apache.commons.io.IOUtils;
import org.commonjava.indy.service.ui.exception.IndyUIException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.Charset;

public class ResourceUtils
{
    public static String loadClasspathContent( final String jsFile )
            throws IndyUIException
    {
        try (InputStream jsStream = Thread.currentThread().getContextClassLoader().getResourceAsStream( jsFile ))
        {
            if ( jsStream == null )
            {
                throw new IndyUIException( "Failed to load javascript from classpath: %s. Resource not found.",
                                           jsFile );
            }

            return IOUtils.toString( jsStream, Charset.defaultCharset() );
        }
        catch ( final IOException e )
        {
            throw new IndyUIException( "Failed to read javascript from classpath: %s. Reason: %s.", e, jsFile,
                                       e.getMessage() );
        }
    }
}
