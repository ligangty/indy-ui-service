/**
 * Copyright (C) 2011-2020 Red Hat, Inc. (https://github.com/Commonjava/indy)
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
package org.commonjava.indy.service.models.promote;

import org.eclipse.microprofile.openapi.annotations.media.Schema;

import java.util.UUID;

/**
 * Created by ruhan on 12/5/18.
 */
@SuppressWarnings( "unused" )
public abstract class AbstractPromoteRequest<T extends PromoteRequest>
        implements PromoteRequest
{
    @Schema( description = "Asynchronous call. A callback url is needed when it is true." )
    protected boolean async;

    @Schema( description = "Optional promotion Id" )
    protected String promotionId = UUID.randomUUID().toString(); // default

    @Schema( description = "Callback which is used to send the promotion result." )
    protected CallbackTarget callback;

    @Override
    public boolean isAsync()
    {
        return async;
    }

    public String getPromotionId()
    {
        return promotionId;
    }

    public void setPromotionId( String promotionId )
    {
        this.promotionId = promotionId;
    }

    @Override
    public CallbackTarget getCallback()
    {
        return callback;
    }

    public void setAsync( boolean async )
    {
        this.async = async;
    }

    public void setCallback( CallbackTarget callback )
    {
        this.callback = callback;
    }
}
