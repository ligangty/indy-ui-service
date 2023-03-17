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
package org.commonjava.indy.service.stats;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.commonjava.indy.service.exception.IndyUIException;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.ArrayList;
import java.util.List;

@ApplicationScoped
public class StatsController
{

    @Inject
    ObjectMapper serializer;

    protected StatsController()
    {
    }

    public AddOnListing getActiveAddOns()
    {
        //TODO: There is no addon in new UI!
        // TODO: this is mocked ones

        return new AddOnListing( new ArrayList<>( List.of( new IndyAddOnID().withName( "Content Browse" ),
                                                           new IndyAddOnID().withName( "Content Promotion" ) ) ) );
    }

    public String getActiveAddOnsJavascript()
            throws IndyUIException
    {
        try
        {
            //TODO: there is no addon in new Indy UI
            String template = "'use strict'\n" + "var addons = %s;\n\n"
                    + "var indyAddons = angular.module('indy.addons', ['ngResource']);";
            final String json = serializer.writeValueAsString( getActiveAddOns() );

            return String.format( template, json );
        }
        catch ( final JsonProcessingException e )
        {
            throw new IndyUIException( "Failed to render javascript wrapper for active addons. Reason: %s", e,
                                       e.getMessage() );
        }
    }

}
