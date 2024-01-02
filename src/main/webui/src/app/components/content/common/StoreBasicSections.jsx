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

import React from 'react';
import {PropTypes} from 'prop-types';
import {DisableTimeoutHint, PrefetchHint, Hint} from './Hints.jsx';
import {Filters} from '#utils/Filters.js';
import {Utils} from '#utils/AppUtils.js';
import {TimeUtils} from '#utils/TimeUtils.js';

export const StoreViewBasicSection = ({store})=>{
  let authoritativeIndexHint = "Make the content index authoritative to this repository";
  if(store.type==="hosted"){
    authoritativeIndexHint += " (when readonly, this will be enabled automatically)";
  }
  const readOnlyHint = "If set to readonly, all uploading and deleting operations to this repo are prohibited";
  return <div className="fieldset">
    <div className="detail-field">
        <label>Package Type:</label>
        <span className="key">{store.packageType}</span>
    </div>
    <div className="detail-field">
        <label>Name:</label>
        <span className="key">{store.name}</span>
    </div>
    <div className="detail-field">
      <span>{Filters.checkmark(!store.disabled)}</span>
      <label>Enabled?</label>
      {
        store.disabled && store.disableExpiration &&
        <span className="hint">Set to automatically re-enable at {TimeUtils.timestampToDateFormat(store.disableExpiration)}</span>
      }
    </div>
    {
      store.type==="hosted"&&<div className="detail-field">
        <span>{Filters.checkmark(store.readonly)}</span>
        <label>Readonly?</label>
        {
          store.type==="hosted" && !store.readonly &&
          <span className="hint">{readOnlyHint}</span>
        }
      </div>
    }
    <div className="detail-field">
      <span>{Filters.checkmark(store.authoritative_index)}</span>
      <label>Authoritative index enabled?</label>
      {
        (store.type==="remote" || store.type==="hosted") && !store.authoritative_index &&
        <span className="hint">{authoritativeIndexHint}</span>
      }
    </div>
    <div className="sub-fields">
      <div className="detail-field">
        <label>Disable Timeout:</label>
        <span>{store.disable_timeout}</span>
        <DisableTimeoutHint />
      </div>
    </div>
    <div className="detail-field">
      <label>Local URL:</label>
      <span><a href={Utils.storeHref(store.key)} target="_new">{Utils.storeHref(store.key)}</a></span>
    </div>
    {
      store.type==="remote" &&
      <div className="detail-field">
        <label>Remote URL:</label>
        <span><a href={store.url} target="_new">{store.url}</a></span>
      </div>
    }
    {
      store.type==="remote" && !store.is_passthrough &&
      <div className="sub-fields">
        <div className="detail-field">
          <span>{Filters.checkmark(!store.is_passthrough)}</span>
          <label>Allow Content Caching</label>
          <span><Hint hintKey="passthrough" /></span>
        </div>
        <div>
          <div className="detail-field">
            <label>Content Cache Timeout:</label>
            <span>{TimeUtils.secondsToDuration(store.cache_timeout_seconds)}</span>
          </div>
          <div className="detail-field">
            <label>Metadata Cache Timeout:</label>
            <span>{TimeUtils.secondsToDuration(store.metadata_timeout_seconds, true)}</span>
          </div>
        </div>
      </div>
    }
    {
      store.type==="remote" &&
      <div className="sub-fields">
        <div className="detail-field">
          <label>Pre-fetching Priority:</label>
          <span>{store.prefetch_priority}</span>
          <PrefetchHint />
        </div>
        <div className="detail-field">
          <span>{Filters.checkmark(store.prefetch_rescan)}</span>
          <label>Allow Pre-fetching Rescan?</label>
        </div>
        <div className="detail-field">
          <label>Pre-fetching Listing Type:</label>
          <span>{store.prefetch_listing_type}</span>
        </div>
      </div>
    }
    {
      store.type==="hosted" && store.storage && <div className="detail-field">
        <label>Alternative Storage Directory:</label>
        <span>{store.storage}</span>
      </div>
    }
  </div>;
};

StoreViewBasicSection.propTypes = {
  store: PropTypes.object.isRequired
};
