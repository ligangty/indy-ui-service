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
package org.commonjava.indy.service.ui.models.nfc;

import org.commonjava.indy.service.ui.models.repository.StoreKey;
import org.eclipse.microprofile.openapi.annotations.enums.SchemaType;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@SuppressWarnings( "unused" )
@Schema( description = "Listing of paths that could not be retrieved for a given artifact store",
         name = "not-found cache section" )
public class NotFoundCacheSectionDTO
{

    @Schema( required = true, type = SchemaType.STRING,
             description = "Serialized store key, of the form: '[hosted|group|remote]:name'" )
    private StoreKey key;

    @Schema( required = true, description = "paths that failed retrieval within this store (may be empty)" )
    private Set<String> paths;

    public NotFoundCacheSectionDTO()
    {
    }

    public NotFoundCacheSectionDTO( final StoreKey key, final Collection<String> paths )
    {
        this.key = key;
        this.paths = ( paths instanceof Set ) ? (Set<String>) paths : new HashSet<>( paths );
    }

    public StoreKey getKey()
    {
        return key;
    }

    public Set<String> getPaths()
    {
        return paths;
    }

    public void setKey( StoreKey key )
    {
        this.key = key;
    }

    public void setPaths( Set<String> paths )
    {
        this.paths = paths;
    }

    @Override
    public int hashCode()
    {
        final int prime = 31;
        int result = 1;
        result = prime * result + ( ( key == null ) ? 0 : key.hashCode() );
        return result;
    }

    @Override
    public boolean equals( final Object obj )
    {
        if ( this == obj )
        {
            return true;
        }
        if ( obj == null )
        {
            return false;
        }
        if ( getClass() != obj.getClass() )
        {
            return false;
        }
        final NotFoundCacheSectionDTO other = (NotFoundCacheSectionDTO) obj;
        if ( key == null )
        {
            return other.key == null;
        }
        else
        {
            return key.equals( other.key );
        }
    }

}
