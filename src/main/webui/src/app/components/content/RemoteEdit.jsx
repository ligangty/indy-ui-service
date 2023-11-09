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

/* eslint-disable max-lines */
import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {StoreEditControlPanel as EditControlPanel} from './StoreControlPanels.jsx';
import {DisableTimeoutHint, DurationHint, PrefetchHint, Hint} from './Hints.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Utils} from '../CompUtils.js';
// import Filters from '../Filters.js';
import {TimeUtils} from '../../TimeUtils.js';
import {PACKAGE_TYPES} from '../ComponentConstants.js';
import {jsonRest} from '../../RestClient.js';

const init = (pkgType, storeName, setState) => {
  const getUrl = `/api/admin/stores/${pkgType}/remote/${storeName}`;
  useEffect(()=>{
    const fetchStore = async () =>{
      // get Store data
      let isError = false;
      const response = await jsonRest.get(getUrl);
      if (response.ok){
        let raw = await response.json();
        let storeView = Utils.cloneObj(raw);
        storeView.disabled = raw.disabled === undefined ? false : raw.disabled;
        storeView.useX509 = raw.server_certificate_pem || raw.key_certificate_pem;
        storeView.useProxy = raw.proxy_host && true;
        // eslint-disable-next-line no-extra-parens
        storeView.useAuth = (storeView.useProxy && storeView.proxy_user) || storeView.user;

        // get Store disablement data
        const timeoutUrl = `/api/admin/schedule/store/${storeView.packageType}/${storeView.type}/${storeView.name}/disable-timeout`;
        const timeoutResponse = await jsonRest.get(timeoutUrl);
        let cloned = Utils.cloneObj(storeView);
        if (timeoutResponse.ok){
          const timeout = await timeoutResponse.json();
          cloned.disableExpiration = timeout.expiration;
        }else{
          response.text().then(error=>Utils.logMessage(`disable timeout getting failed! Error reason: ${error}`));
        }

        // Change state and re-rendering
        setState({
          storeView: cloned,
          store: raw
        });
      }else{
        response.text().then(error=>setState({
          message: error
        }));
      }
    };

    fetchStore();
  }, []);
};

const saveStore = store => {
  const getUrl = `/api/admin/stores/${store.packageType}/remote/${store.name}`;
  const postStore = async () =>{
    // get Store data
    let isError = false;
    const response = await jsonRest.post(getUrl, store);
    if (!response.ok){
      response.text().then(error=>Utils.logMessage(error));
    }
    const navigate = useNavigate();
    if(!isError && (response.status >= 200 || response.status < 300)){
      navigate(`/remote/${store.packageType}/view/${store.name}`);
    }
  };
  postStore();
};

const handlers = {
  handleSave: () => {
    // TODO need to implement save logic
  },

  handleCancel: () => {
    // TODO need to implement cancel logic
  },

  handleRemove: () => {
    // TODO need to implement remove logic
  },
};

export default function RemoteEdit() {
  const [state, setState] = useState({
    store: {},
    storeView: {}
  });
  const location = useLocation();
  const path = location.pathname;
  let mode = path.endsWith('remote/new')? 'new':'edit';
  let [pkgType, storeName] = ["",""];
  let store = {};
  if(mode === 'edit'){
    const {packageType, name} = useParams();
    [pkgType, storeName] = [packageType, name];
    init(pkgType, storeName, setState);
    store = state.store;
  }

  mode = state.mode;
  // Utils.logMessage(mode);
  let storeView = state.storeView;
  // let store = state.store;
  // TODO this package types should be fetched from backend
  let pkgTypes = PACKAGE_TYPES;

  const handleCheckChange = (event, field) => {
    if (event.target.checked) {
      store[field] = true;
    } else {
      store[field] = false;
    }
  };
  const handleValueChange = (event, field) => {
    store[field] = event.target.value;
  };
  const handleRadioChange = (event, field) => {
    store[field] = event.target.value;
  };

  const handleUseProxy = event=>{
    // TODO: need to implement
  };
  const handleUseAuth = event => {
    // TODO: need to implement
  };
  const handleUseX509 = event => {
    // TODO: need to implement
  };

  const CertificateSection = function(){
    return (
      <div className="sub-fields">
      {
        storeView.useAuth &&
        <div className="detail-field">
          <label>Client Key Password:</label>
          <input type="password" value={storeView.key_password} onChange={e=>handleValueChange(e, "key_password")}/><Hint hintKey="client_key" />
        </div>
      }
        <div className="fieldset two-col">
          {
            storeView.useAuth &&
            <div className="left-col">
              <div className="textarea-label">
                <label>Client Key</label><span className="hint">(PEM Format)</span>
              </div>
              {
                // 64 columns is the original PEM line-length spec
              }
              <textarea className="cert" cols="68" value={storeView.key_certificate_pem} onChange={e=>handleValueChange(e, "key_certificate_pem")}></textarea>
            </div>
          }
          <div className="right-col">
            <div className="textarea-label">
              <label>Server Certificate</label><span className="hint">(PEM Format)</span>
            </div>
            {
              // 64 columns is the original PEM line-length spec
            }
            <textarea className="cert" cols="68" value={storeView.server_certificate_pem} onChange={e=>handleValueChange(e, "server_certificate_pem")}></textarea>
          </div>
        </div>
    </div>
    );
  };

  return (
    <div className="container-fluid">

      <div className="control-panel">
        <EditControlPanel
          handleSave={handlers.handleSave}
          handleCancel={handlers.handleCancel}
          handleRemove={handlers.handleRemove} />
      </div>

      <div className="content-panel">

        <div className="fieldset-caption">Basics</div>
        <div className="fieldset">
          <div className="detail-field">
            <label>Package Type:</label>
            {
              mode==='new'?
              <span>
                <select>
                  {
                    pkgTypes.map(type => <option key={`pkgType:${type}`} value={type}>{type}</option>)
                  }
                </select>
              </span>:
              <span className="key">{storeView.packageType}</span>
            }
          </div>
          <div className="detail-field">
            <label>Name:</label>
            {
              mode==='new'?
              <span><input type="text" size="25" /></span>:
              <span className="key">{storeView.name}</span>
            }
          </div>

          <div className="detail-field">
            <input type="checkbox" checked={!storeView.disabled} onChange={e => handleCheckChange(e, "disabled")} />{' '}
            <label>Enabled?</label>
            {
              storeView.disabled && store.disableExpiration &&
              <span className="hint">Set to automatically re-enable at {TimeUtils.timestampToDateFormat(storeView.disableExpiration)}</span>
            }
          </div>
          <div className="detail-field">
            <input type="checkbox" checked={store.authoritative_index} onChange={e => handleCheckChange(e, "authoritative_index")} />{' '}
            <label>Authoritative content Index?</label>
            <span className="hint">Make the content index authoritative to this repository</span>
          </div>

          <div className="sub-fields">
            <div className="detail-field">
              <label>Disable Timeout:</label>
              <input type="text" value={store.disable_timeout} onChange={e => handleValueChange(e, "disable_timeout")} />
              <DisableTimeoutHint />
            </div>
          </div>

          <div className="detail-field">
            <label>Remote URL:</label>
            <input type="text" value={store.url} size="92"/>
          </div>

          <div className="sub-fields">
            <div className="detail-field">
              <input type="checkbox" value={store.is_passthrough} onChange={e => handleCheckChange(e, "is_passthrough")} />{' '}
              <label>{"Don't Cache Content"}</label>
              <Hint hintKey="passthrough"/>
            </div>
            {!store.is_passthrough && <React.Fragment>
              <div className="detail-field">
                <label>Content Cache Timeout:</label>
                <input type="text" value={store.cache_timeout_seconds} onChange={e => handleValueChange(e, "cache_timeout_seconds")} />
                <DurationHint />
              </div>
              <div className="detail-field">
                <label>Metadata Cache Timeout:</label>
                <input type="text" value={store.metadata_timeout_seconds} onChange={e => handleValueChange(e, "metadata_timeout_seconds")} />
                <DurationHint>{'24h 36m 00s. Negative means never timeout, 0 means using default timeout by Indy settings.'}</DurationHint>
              </div>
            </React.Fragment>
            }
          </div>

          <div className="sub-fields">
            <div className="detail-field">
              <label>Pre-fetching Priority:</label>
              <input type="text" value={storeView.prefetch_priority} onChange={e=>handleValueChange(e,"prefetch_priority")} size="5"/>
              <PrefetchHint />
            </div>
            <div className="detail-field">
              <span><input type="checkbox" checked={storeView.prefetch_rescan} onChange={e=>handleCheckChange(e,"prefetch_rescan")} /></span>{' '}
              <label>Allow Pre-fetching Rescan?</label>
            </div>
            <div className="detail-field">
              <label>Pre-fetching Listing Type:</label>
              <input type="radio" checked={storeView.prefetch_listing_type==="html"} onChange={e=>handleRadioChange(e, "prefetch_listing_type")} value="html"/> <span>html</span>{' '}
              <input type="radio" checked={storeView.prefetch_listing_type==="koji"} onChange={e=>handleRadioChange(e, "prefetch_listing_type")} value="koji"/> <span>koji</span>
            </div>
          </div>
        </div>


        <div className="fieldset-caption">Description</div>
        <div className="fieldset">
          <textarea rows="3" className="text-description" onChange={e=>handleValueChange(e,"description")}>{storeView.description}</textarea>
        </div>

        <div className="fieldset-caption">Capabilities</div>
        <div className="fieldset">
          <div className="detail-field">
            <span><input type="checkbox" checked={storeView.allow_releases} onChange={e=>handleCheckChange(e, "allow_releases")}/></span>{' '}
            <label>Allow Releases</label>
          </div>
          <div className="detail-field">
            <span><input type="checkbox" checked={storeView.allow_snapshots} onChange={e=>handleCheckChange(e, "allow_snapshots")}/></span>{' '}
            <label>Allow Snapshots</label>
          </div>
        </div>

        <div className="fieldset-caption">Remote Access</div>
        <div className="fieldset">
          <div className="detail-field">
            <label>Request Timeout:</label>
            <input type="text" value={storeView.timeout_seconds} onChange={e=>handleValueChange(e, "timeout_seconds")}/>
            <DurationHint />
          </div>
          <div className="detail-hint">
            <Hint hintKey="request_timeout" />
          </div>

          {
            // HTTP Proxy
          }
          <div className="detail-field">
            <input type="checkbox" checked={storeView.use_proxy} onChange={e=>handleUseProxy(e)} />{' '}
            <label>Use Proxy?</label>
          </div>
          {
            storeView.useProxy&&
            <div className="sub-fields">
              <div className="detail-field">
                <label>Proxy Host:</label>
                <input type="text" value="raw.proxy_host" onChange={e=>handleValueChange(e,"proxy_host")} size="20"/>
              </div>
              <div className="detail-field">
                <label>Proxy Port:</label>
                <input type="text" value="raw.proxy_port" onChange={e=>handleValueChange(e,"proxy_port")} size="6"/>
              </div>
            </div>
          }
          {
            // X.509 / auth
          }
          <div className="detail-field">
            <input type="checkbox" checked={storeView.useAuth} onChange={e=>handleUseAuth(e)} />{' '}
            <label>Use Authentication?</label>
          </div>
          {
            storeView.useAuth &&
            <div className="sub-fields">
              <div className="detail-field">
                <label>Username:</label>
                <input type="text" value={storeView.user} onChange={e=>handleValueChange(e, "user")} size="25"/>
              </div>
              <div className="detail-field">
                <label>Password:</label>
                <input type="password" value={storeView.password} onChange={e=>handleValueChange(e, "password")} size="25"/>
              </div>
              {
                storeView.use_proxy && <React.Fragment>
                <div className="detail-field">
                  <label>Proxy Username:</label>
                  <input type="text" value={storeView.proxy_user} onChange={e=>handleValueChange(e, "proxy_user")} size="20"/>
                </div>
                <div className="detail-field">
                  <label>Proxy Password:</label>
                  <input type="password" value={storeView.proxy_password} onChange={e=>handleValueChange(e, "proxy_password")} size="20"/>
                </div>
              </React.Fragment>
              }
            </div>
          }
          <div className="detail-field">
            <input type="checkbox" checked={storeView.useX509} onChange={e=>handleUseX509(e)} />{' '}
            <label>{`Use Custom X.509 Configuration?`}</label>
          </div>
          {
            storeView.useX509 && <CertificateSection />
          }
        </div>
      </div>
      {
        // <ViewJsonDebugger enableDebug={enableDebug} storeJson={storeJson} rawJson={rawJson}
      }
    </div>
  );
}

RemoteEdit.propTypes={
  store: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
