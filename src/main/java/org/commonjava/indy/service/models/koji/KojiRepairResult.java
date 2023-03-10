/**
 * Copyright (C) 2011-2022 Red Hat, Inc. (https://github.com/Commonjava/indy)
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
package org.commonjava.indy.service.models.koji;

import org.commonjava.indy.service.models.repository.StoreKey;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.ArrayList;
import java.util.List;

/**
 * Contains the result of a repair attempt. If it is a success, the error will be <b>null</b>.
 *
 * @author ruhan
 *
 */
@SuppressWarnings( "unused" )
public class KojiRepairResult
{
    @Schema( description = "Original request" )
    private KojiRepairRequest request;

    @Schema( description = "Error message if failed" )
    private String error;

    @Schema( description = "Exception object if failed because of exception" )
    private Exception exception;

    @Schema( description = "Result entries if succeeded" )
    private List<RepairResult> results;

    public KojiRepairResult()
    {
    }

    public boolean succeeded()
    {
        return error == null;
    }

    public String getError()
    {
        return error;
    }

    public KojiRepairRequest getRequest()
    {
        return request;
    }

    public List<RepairResult> getResults()
    {
        return results;
    }

    public Exception getException()
    {
        return exception;
    }

    /**
     * Repair result object of one store
     */
    public static class RepairResult
    {
        private StoreKey storeKey;

        private List<PropertyChange> changes;

        private boolean ignored;

        private Exception exception;

        public StoreKey getStoreKey()
        {
            return storeKey;
        }

        public List<PropertyChange> getChanges()
        {
            return changes;
        }

        public boolean isIgnored()
        {
            return ignored;
        }

        public void setIgnored( boolean ignored )
        {
            this.ignored = ignored;
        }

        public boolean isChanged()
        {
            return changes != null && !changes.isEmpty();
        }

        public Exception getException()
        {
            return exception;
        }

        @Override
        public String toString()
        {
            return "RepairResult{" + "storeKey=" + storeKey + ", changes=" + changes + ", ignored=" + ignored
                    + ", exception=" + exception + '}';
        }
    }

    public static class PropertyChange
    {
        private String name;

        private Object originalValue;

        private Object value;

        public String getName()
        {
            return name;
        }

        public boolean isChanged()
        {
            return ( originalValue == null && value != null ) || !originalValue.equals( value );
        }

        public Object getOriginalValue()
        {
            return originalValue;
        }

        public void setOriginalValue( Object originalValue )
        {
            this.originalValue = originalValue;
        }

        public Object getValue()
        {
            return value;
        }

        public void setValue( Object value )
        {
            this.value = value;
        }

        @Override
        public String toString()
        {
            return "PropertyChange{" + "name='" + name + '\'' + ", originalValue=" + originalValue + ", value=" + value
                    + '}';
        }
    }
}
