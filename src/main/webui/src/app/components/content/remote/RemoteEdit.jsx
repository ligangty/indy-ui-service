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

import React, {useState, useEffect} from 'react';
import {useLocation, useParams} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {StoreEditControlPanel as EditControlPanel} from '../common/StoreControlPanels.jsx';
import {DisableTimeoutHint, DurationHint, PrefetchHint, Hint} from '../common/Hints.jsx';
import {PackageTypeSelect} from '../common/PackageTypeSelect.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Utils} from '#utils/AppUtils.js';
import {TimeUtils} from '#utils/TimeUtils.js';
import {jsonRest} from '#utils/RestClient.js';
import {STORE_API_BASE_URL} from "../../ComponentConstants.js";

const init = (pkgType, storeName, setState) => {
  const getUrl = `${STORE_API_BASE_URL}/${pkgType}/remote/${storeName}`;
  useEffect(()=>{
    const fetchStore = async () =>{
      // get Store data
      const response = await jsonRest.get(getUrl);
      if (response.ok){
        const raw = await response.json();
        const storeView = Utils.cloneObj(raw);
        storeView.disabled = raw.disabled === undefined ? false : raw.disabled;
        storeView.useX509 = raw.server_certificate_pem || raw.key_certificate_pem;
        storeView.useProxy = raw.proxy_host && true;
        // eslint-disable-next-line no-extra-parens
        storeView.useAuth = (storeView.useProxy && storeView.proxy_user) || storeView.user;

        // get Store disablement data
        const timeoutUrl = `/api/admin/schedule/store/${storeView.packageType}/${storeView.type}/${storeView.name}/disable-timeout`;
        const timeoutResponse = await jsonRest.get(timeoutUrl);
        const cloned = Utils.cloneObj(storeView);
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
        // TODO: find another way to do error handling
        response.text().then(error=>setState({
          message: error
        }));
      }
    };

    fetchStore();
  }, []);
};

const CertificateSection = ({store, handleValueChange}) => <div className="sub-fields">
  {
    store.useAuth &&
    <div className="detail-field">
      <label>Client Key Password:</label>
      <input type="password" value={store.key_password} onChange={e => handleValueChange(e, "key_password")}/><Hint hintKey="client_key" />
    </div>
  }
    <div className="fieldset two-col">
      {
        store.useAuth &&
        <div className="left-col">
          <div className="textarea-label">
            <label>Client Key</label><span className="hint">(PEM Format)</span>
          </div>
          {
            // 64 columns is the original PEM line-length spec
          }
          <textarea className="cert" cols="68" value={store.key_certificate_pem} onChange={e=>handleValueChange(e, "key_certificate_pem")}></textarea>
        </div>
      }
      <div className="right-col">
        <div className="textarea-label">
          <label>Server Certificate</label><span className="hint">(PEM Format)</span>
        </div>
        {
          // 64 columns is the original PEM line-length spec
        }
        <textarea className="cert" cols="68" value={store.server_certificate_pem} onChange={e=>handleValueChange(e, "server_certificate_pem")}></textarea>
      </div>
    </div>
</div>;

CertificateSection.propTypes = {
  store: PropTypes.object.isRequired,
  handleValueChange: PropTypes.func
};

export default function RemoteEdit() {
  const [state, setState] = useState({
    store: {},
    storeView: {}
  });
  const location = useLocation();
  const path = location.pathname;
  const mode = path.match(/.*\/new$/u)? 'new':'edit';
  let [pkgType, storeName] = ["",""];
  // Give a default packageType
  let store = {"packageType": "maven", "type": "remote"};
  if(mode === 'edit'){
    const {packageType, name} = useParams();
    [pkgType, storeName] = [packageType, name];
    init(pkgType, storeName, setState);
    store = state.store;
  }

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

  return (
    <div className="container-fluid">

      <div className="control-panel">
        <EditControlPanel mode={mode} store={store} />
      </div>

      <div className="content-panel">

        <div className="fieldset-caption">Basics</div>
        <div className="fieldset">
          <div className="detail-field">
            <label>Package Type:</label>
            {
              mode==='new'||mode==='edit'?
              <React.Fragment>
                <PackageTypeSelect
                  packageType={store.packageType}
                  vauleChangeHandler={e => handleValueChange(e, "packageType")} />
              </React.Fragment>:
              <span className="key">{store.packageType}</span>
            }
          </div>
          <div className="detail-field">
            <label>Name:</label>
            {
              mode==='new'?
              <span><input type="text" size="25" onChange={e => handleValueChange(e, "name")} /></span>:
              <span className="key">{store.name}</span>
            }
          </div>

          <div className="detail-field">
            <input type="checkbox" checked={!store.disabled} onChange={e => handleCheckChange(e, "disabled")} />{' '}
            <label>Enabled?</label>
            {
              store.disabled && store.disableExpiration &&
              <span className="hint">Set to automatically re-enable at {TimeUtils.timestampToDateFormat(store.disableExpiration)}</span>
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
              <input type="text" value={store.prefetch_priority} onChange={e=>handleValueChange(e,"prefetch_priority")} size="5"/>
              <PrefetchHint />
            </div>
            <div className="detail-field">
              <span><input type="checkbox" checked={store.prefetch_rescan} onChange={e=>handleCheckChange(e,"prefetch_rescan")} /></span>{' '}
              <label>Allow Pre-fetching Rescan?</label>
            </div>
            <div className="detail-field">
              <label>Pre-fetching Listing Type:</label>
              <input type="radio" checked={store.prefetch_listing_type==="html"} onChange={e=>handleRadioChange(e, "prefetch_listing_type")} value="html"/> <span>html</span>{' '}
              <input type="radio" checked={store.prefetch_listing_type==="koji"} onChange={e=>handleRadioChange(e, "prefetch_listing_type")} value="koji"/> <span>koji</span>
            </div>
          </div>
        </div>


        <div className="fieldset-caption">Description</div>
        <div className="fieldset">
          <textarea rows="3" className="text-description" onChange={e=>handleValueChange(e,"description")}>{store.description}</textarea>
        </div>

        <div className="fieldset-caption">Capabilities</div>
        <div className="fieldset">
          <div className="detail-field">
            <span><input type="checkbox" checked={store.allow_releases} onChange={e=>handleCheckChange(e, "allow_releases")}/></span>{' '}
            <label>Allow Releases</label>
          </div>
          <div className="detail-field">
            <span><input type="checkbox" checked={store.allow_snapshots} onChange={e=>handleCheckChange(e, "allow_snapshots")}/></span>{' '}
            <label>Allow Snapshots</label>
          </div>
        </div>

        <div className="fieldset-caption">Remote Access</div>
        <div className="fieldset">
          <div className="detail-field">
            <label>Request Timeout:</label>
            <input type="text" value={store.timeout_seconds} onChange={e=>handleValueChange(e, "timeout_seconds")}/>
            <DurationHint />
          </div>
          <div className="detail-hint">
            <Hint hintKey="request_timeout" />
          </div>

          {
            // HTTP Proxy
          }
          <div className="detail-field">
            <input type="checkbox" checked={store.use_proxy} onChange={e=>handleUseProxy(e)} />{' '}
            <label>Use Proxy?</label>
          </div>
          {
            store.useProxy&&
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
            <input type="checkbox" checked={store.useAuth} onChange={e=>handleUseAuth(e)} />{' '}
            <label>Use Authentication?</label>
          </div>
          {
            store.useAuth &&
            <div className="sub-fields">
              <div className="detail-field">
                <label>Username:</label>
                <input type="text" value={store.user} onChange={e=>handleValueChange(e, "user")} size="25"/>
              </div>
              <div className="detail-field">
                <label>Password:</label>
                <input type="password" value={store.password} onChange={e=>handleValueChange(e, "password")} size="25"/>
              </div>
              {
                store.use_proxy && <React.Fragment>
                <div className="detail-field">
                  <label>Proxy Username:</label>
                  <input type="text" value={store.proxy_user} onChange={e=>handleValueChange(e, "proxy_user")} size="20"/>
                </div>
                <div className="detail-field">
                  <label>Proxy Password:</label>
                  <input type="password" value={store.proxy_password} onChange={e=>handleValueChange(e, "proxy_password")} size="20"/>
                </div>
              </React.Fragment>
              }
            </div>
          }
          <div className="detail-field">
            <input type="checkbox" checked={store.useX509} onChange={e=>handleUseX509(e)} />{' '}
            <label>{`Use Custom X.509 Configuration?`}</label>
          </div>
          {
            store.useX509 && <CertificateSection store={store} handleValueChange={handleValueChange} />
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
