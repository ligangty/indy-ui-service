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
package org.commonjava.indy.service.ui.models.repository;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.io.Externalizable;
import java.io.IOException;
import java.io.ObjectInput;
import java.io.ObjectOutput;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Schema(
        description = "Grouping of other artifact stores, with a defined order to the membership that determines content preference" )
public class Group
        extends ArtifactStore
        implements Externalizable
{

    private static final int STORE_VERSION = 1;

    private List<StoreKey> constituents;

    @JsonProperty( "prepend_constituent" )
    private boolean prependConstituent = false;

    public Group()
    {
        super();
        this.constituents = new ArrayList<>();
    }

    public Group( final String packageType, final String name, final List<StoreKey> constituents )
    {
        super( packageType, StoreType.group, name );
        this.constituents = new ArrayList<>( constituents );
    }

    public List<StoreKey> getConstituents()
    {
        return constituents == null ? Collections.emptyList() : Collections.unmodifiableList( constituents );
    }

    public boolean isPrependConstituent()
    {
        return prependConstituent;
    }

    public void setPrependConstituent( boolean prependConstituent )
    {
        this.prependConstituent = prependConstituent;
    }

    @Override
    public String toString()
    {
        return String.format( "Group[%s]", getName() );
    }


    @Override
    public void writeExternal( final ObjectOutput out )
            throws IOException
    {
        super.writeExternal( out );

        out.writeInt( STORE_VERSION );

        out.writeObject( constituents );

        out.writeBoolean( prependConstituent );
    }

    @Override
    public void readExternal( final ObjectInput in )
            throws IOException, ClassNotFoundException
    {
        super.readExternal( in );

        int storeVersion = in.readInt();
        if ( storeVersion > STORE_VERSION )
        {
            throw new IOException( "Cannot deserialize. Group version in data stream is: " + storeVersion
                                           + " but this class can only deserialize up to version: " + STORE_VERSION );
        }

        //noinspection unchecked
        this.constituents = (List<StoreKey>) in.readObject();

        this.prependConstituent = in.readBoolean();
    }

}
