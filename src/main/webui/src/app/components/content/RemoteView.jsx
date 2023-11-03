//
// Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//         http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

/* eslint-disable max-lines */
import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {StoreViewControlPanel as ControlPanel} from './StoreControlPanels.jsx';
import {DisableTimeoutHint, PrefetchHint, Hint, PasswordMask} from './Hints.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Utils} from '../CompUtils.js';
import {Filters} from '../Filters.js';
import {TimeUtils} from '../../TimeUtils.js';
import axios from 'axios';

const init = (pkgType, storeName, setState) => {
  const storeUrl = `/api/admin/stores/${pkgType}/remote/${storeName}`;
  useEffect(()=>{
    const fetchStore = async () =>{
      // get Store data
      let isError = false;
      const response = await axios.get(storeUrl).catch(error =>{
        isError = true;
        let message = "";
        if (error.response) {
          message = JSON.parse(error.response.data).error;
        }else{
          message = error;
        }
        setState({
          message
        });
      });
      if (!isError){
        let raw = response.data;
        let store = Utils.cloneObj(raw);
        store.disabled = raw.disabled === undefined ? false : raw.disabled;
        store.useX509 = raw.server_certificate_pem || raw.key_certificate_pem;
        store.useProxy = raw.proxy_host && true;
        store.useAuth = store.useProxy && store.proxy_user;
        store.useAuth = store.useAuth || store.user;

        // get Store disablement data
        const timeoutUrl = `/api/admin/schedule/store/${store.packageType}/${store.type}/${store.name}/disable-timeout`;
        const timeoutResponse = await axios.get(timeoutUrl).catch(error=>{
          isError = true;
          Utils.logMessage(`disable timeout getting failed! Error reason: ${error}`);
        });
        let newStore = Utils.cloneObj(store);
        if (!isError){
          newStore.disableExpiration = timeoutResponse.data.expiration;
        }
        // Change state and re-rendering
        setState({
          store: newStore
        });
      }
    };

    fetchStore();
  }, []);
};
const handlers = {
  handleDisable: () => {
    // mock
  },
  handleEnable: () => {
    // mock
  },
  // handleEdit: () => {
  //   navigate(`/remote/${pkgType}/edit/${storeName}`);
  // },
  handleCreate: () => {
    // mock
  },
  handleRemove: () => {
    // mock
  }
};

export default function RemoteView() {
  const [state, setState] = useState({
    store: {},
    raw: {},
    message: ''
  });
  const {packageType, name} = useParams();
  init(packageType, name, setState);
  let store = state.store;
  if(!Utils.isEmptyObj(store)) {
    return (
      <div className="container-fluid">
        <div className="control-panel">
          <ControlPanel
            enabled={!store.disabled}
            storeObj={store}
            // storeType="remote"
            // pkgType={packageType}
            // storeName={name}
            // handleEnable={handlers.handleEnable}
            // handleDisable={handlers.handleDisable}
            // handleEdit={()=>navigate(`/remote/${pkgType}/edit/${storeName}`)}
            // handleCreate={handlers.handleCreate}
            // handleRemove={handlers.handleRemove}
          />
        </div>

        <div className="content-panel">
          <div className="fieldset-caption">Basics</div>
          <BasicSection store={store} />

          <div className="fieldset-caption">Description</div>
          <div className="fieldset">
            <div className="text-field">
              <textarea readOnly className="text-description" value={store.description} />
            </div>
          </div>

          <div className="fieldset-caption">Capabilities</div>
          <div className="fieldset">
            {
              (store.allow_releases || store.allow_snapshots) &&

                <div>
                  <div className="detail-field">
                    <span>{Filters.checkmark(store.allow_releases)}</span>
                    <label>Allow Releases</label>
                  </div>
                  <div className="detail-field">
                    <span>{Filters.checkmark(store.allow_snapshots)}</span>
                    <label>Snapshots Allowed?</label>
                  </div>
                </div>

            }
          </div>

          <div className="fieldset-caption">Remote Access</div>
          <RemoteAccessSection store={store} />
        </div>
        {
          // <ViewJsonDebugger enableDebug={false} storeJson={store} rawJson={raw} />
        }
      </div>
    );
  }
  return null;
}

// eslint-disable-next-line max-lines-per-function
const BasicSection = ({store})=> <div className="fieldset">
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
    <div className="detail-field">
      <span>{Filters.checkmark(store.authoritative_index)}</span>
      <label>Authoritative index enabled?</label>
      {
        !store.authoritative_index &&
        <span className="hint">Make the content index authoritative to this repository</span>
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
      {
        // TODO: is this store.demo still available now?
        store.demo ?
        <span>{Utils.storeHref(store.key)}</span> :
        <span><a href={Utils.storeHref(store.key)} target="_new">{Utils.storeHref(store.key)}</a></span>
      }
    </div>
    <div className="detail-field">
      <label>Remote URL:</label>
      <span><a href={store.url} target="_new">{store.url}</a></span>
    </div>
    <div className="sub-fields">
      <div className="detail-field">
        <span>{Filters.checkmark(!store.is_passthrough)}</span>
        <label>Allow Content Caching</label>
        <span><Hint hintKey="passthrough" /></span>
      </div>
      {
        !store.is_passthrough &&

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

      }
    </div>

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
  </div>;

BasicSection.propTypes = {
  store: PropTypes.object.isRequired
};

const RemoteAccessSection = ({store})=> <div className="fieldset">
  <div className="detail-field">
    <label>Request Timeout:</label>
    <span>{TimeUtils.secondsToDuration(store.timeout_seconds)}</span>
    <span><Hint hintKey="request_timeout" /></span>
  </div>

  {
    // HTTP Proxy
  }
  <div className="detail-field">
    <span>{Filters.checkmark(store.useProxy)}</span>
    <label>Use Proxy?</label>
  </div>
  {
    store.useProxy &&

      <div className="sub-fields">
        <div className="detail-field">
          <label>Proxy Host:</label>
          <span>{store.proxy_host}</span>
        </div>
        <div className="detail-field">
          <label>Proxy Port:</label>
          <span>{store.proxy_port}</span>
        </div>
      </div>

  }
  {
    // X.509 / auth
  }
  <div className="detail-field">
    <span>{Filters.checkmark(store.useAuth)}</span>
    <label>Use Authentication?</label>
  </div>
  {
      store.useAuth &&
        <div className="sub-fields">
        {
          store.user &&
          <div className="detail-field">
            <label>Username:</label>
            <span>{store.user}</span>
          </div>
        }
        {
          store.password &&
          <div className="detail-field">
            <label>Password:</label>
            <span><PasswordMask /></span>
          </div>
        }
        {
          store.useProxy && store.proxy_user &&
          <div className="detail-field">
            <label>Proxy Username:</label>
            <span>{store.proxy_user}</span>
          </div>
        }
        {
          store.useProxy && store.proxy_password &&
          <div className="detail-field">
            <label>Proxy Password:</label>
            <span><PasswordMask /></span>
          </div>
        }
        </div>

  }
  <div className="detail-field">
      <span>{Filters.checkmark(store.useX509)}</span>
      <label>Use Custom X.509 Configuration?</label>
  </div>
  {
    store.useX509 &&

      <div className="sub-fields">
      {
        store.key_password &&
        <div className="detail-field">
          <label>Client Key Password:</label>
          <span><ap-password-mask></ap-password-mask></span>
        </div>
      }
        <div className="fieldset two-col">
        {
          store.key_certificate_pem &&
          <div className="left-col">
            <div className="textarea-label">
              <label>Client Key</label><span className="hint">(PEM Format)</span>
            </div>
            {
              // 64 columns is the original PEM line-length spec
            }
            <textarea readOnly className="cert" value={store.key_certificate_pem} />
          </div>
        }
        {
          store.server_certificate_pem &&
          <div className="right-col">
            <div className="textarea-label">
              <label>Server Certificate</label><span className="hint">(PEM
                Format)</span>
            </div>
            {
              // 64 columns is the original PEM line-length spec
            }
            <textarea readOnly className="cert" value={store.server_certificate_pem} />
          </div>
        }
        </div>
      </div>

  }
</div>;

RemoteAccessSection.propTypes={
  store: PropTypes.object.isRequired
};
