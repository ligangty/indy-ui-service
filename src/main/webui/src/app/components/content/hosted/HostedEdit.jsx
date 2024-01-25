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
import {useForm} from 'react-hook-form';
import {PropTypes} from 'prop-types';
import {StoreEditControlPanel as EditControlPanel} from '../common/StoreControlPanels.jsx';
import {DisableTimeoutHint, DurationHint} from '../common/Hints.jsx';
import {PackageTypeSelect} from '../common/PackageTypeSelect.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Utils} from '#utils/AppUtils.js';
import {TimeUtils} from '#utils/TimeUtils.js';
import {IndyRest} from '#utils/RestClient.js';
import {Filters} from '#utils/Filters.js';

const {storeRes, disableRes} = IndyRest;


const EditCapabilities = ({allowReleases, allowSnapshots, register}) => {
  const [canSnapshot, setSnapshot] = useState(allowSnapshots);
  const [canRelease, setRelease] = useState(allowReleases);

  if (canRelease === undefined && allowReleases !== undefined) {
    setRelease(allowReleases);
  }

  if (canSnapshot === undefined && allowSnapshots !== undefined) {
    setSnapshot(allowSnapshots);
  }

  return <div className="fieldset">
    <div className="detail-field">
      <span>{Filters.checkmark(canRelease || canSnapshot)}</span>
      <label>Allow Uploads</label>
    </div>
    <div className="detail-field">
      <span>
        <input type="checkbox" onClick={e => setRelease(e.target.checked)} defaultChecked={canRelease} {...register("allow_releases")} />
      </span>{' '}
      <label>Allow Releases</label>
    </div>
    <div className="detail-field">
      <span>
        <input type="checkbox" onClick={e => setSnapshot(e.target.checked)} defaultChecked={canSnapshot} {...register("allow_snapshots")} />
      </span>{' '}
      <label>Allow Snapshots</label>
    </div>
    {
      canSnapshot &&
      <div className="sub-fields">
        <div className="detail-field">
          <label>Snapshot Timeout:</label>
          <span><input type="text" defaultChecked={canSnapshot} {...register("snapshotTimeoutSeconds")} /></span>
          <DurationHint />
        </div>
      </div>
    }
  </div>;
};

EditCapabilities.propTypes = {
  allowReleases: PropTypes.bool,
  allowSnapshots: PropTypes.bool,
  register: PropTypes.function,
};

export default function HostedEdit() {
  const [state, setState] = useState({
    store: {},
    storeView: {}
  });
  const location = useLocation();
  const {packageType, name} = useParams();
  const {
    register,
    reset,
    trigger,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const path = location.pathname;
  const mode = path.match(/.*\/new$/u)? 'new':'edit';
  // Give a default packageType
  let store = {"packageType": "maven", "type": "hosted"};
  useEffect(()=>{
    if(mode === 'edit'){
      (async () =>{
        // get Store data
        const res = await storeRes.get(packageType, "hosted", name);
        if (res.success){
          const raw = res.result;
          const storeView = Utils.cloneObj(raw);
          storeView.disabled = raw.disabled === undefined ? false : raw.disabled;
          // get Store disablement data
          const timeoutRes = await disableRes.getStoreTimeout(packageType, "hosted", name);
          const cloned = Utils.cloneObj(storeView);
          if (timeoutRes.success){
            const timeout = timeoutRes.result;
            cloned.disableExpiration = timeout.expiration;
          }else{
            Utils.logMessage(`disable timeout getting failed! Error reason: ${timeoutRes.error.message}`);
          }
          // Change state and re-rendering
          setState({
            storeView: cloned,
            store: raw
          });
          reset(raw);
        }else{
          // TODO: find another way to do error handling
          Utils.logMessage(`Failed to get store data. Error reason: ${res.error.status}->${res.error.message}`);
        }
      })();
    }
  }, [packageType, name, mode, reset]);

  if (mode === 'edit'){
    store = state.store;
  }

  const changelog = register("changelog");
  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="control-panel">
        <EditControlPanel mode={mode} store={store}
         handleSubmit={handleSubmit} validate={trigger} changelog={changelog} />
      </div>

      <div className="content-panel">
        <div className="fieldset-caption">Basics</div>
        <div className="fieldset">
          <div className="detail-field">
            <label>Package Type:</label>
            {
              mode==='new'?
                <PackageTypeSelect register={register} formErrors={errors} />:
              <span className="key">{store.packageType}</span>
            }
          </div>
          <div className="detail-field">
            <label>Name:</label>
            {
              mode==='new'?
              <span>
                <input type="text" size="25" {...register("name", {required: true, maxLength: 50})}
                />{' '}
                {errors.name?.type === "required" && <span className="alert">Name is required</span>}
                {errors.name?.type === "maxLength" && <span className="alert">Name&apos;s length should be less than 50</span>}
              </span>:
              <span className="key">{store.name}</span>
            }
          </div>

          <div className="detail-field">
            <input type="checkbox" defaultChecked={!store.disabled} {...register("enabled")}/>{' '}
            <label>Enabled?</label>
            {
              store.disabled && store.disableExpiration &&
              <span className="hint">Set to automatically re-enable at {TimeUtils.timestampToDateFormat(store.disableExpiration)}</span>
            }
          </div>
          <div className="detail-field">
            <input type="checkbox" defaultChecked={store.readonly} {...register("readonly")}/>{' '}
            <label>Readonly?</label>
            <span className="hint">If set to readonly, all uploading and deleting operations to this repo are prohibited</span>
          </div>
          <div className="detail-field">
            <input type="checkbox" defaultChecked={store.authoritative_index} {...register("authoritative_index")} />{' '}
            <label>Authoritative content Index?</label>
            <span className="hint">Make the content index authoritative to this repository</span>
          </div>

          <div className="sub-fields">
            <div className="detail-field">
              <label>Disable Timeout:</label>
              <input type="number" defaultValue={store.disable_timeout}
               {...register("disable_timeout", {min: -1, max: 999999999})}/>{' '}
              {errors.disable_timeout && <span className="alert">Not a valid number</span>}<br />
              <DisableTimeoutHint />
            </div>
          </div>

          <div className="detail-field">
            <label>Storage Directory:</label>
            <span><input type="text" defaultValue={store.storage} {...register("storage")}/></span>
            <span className="hint">(calculated by default)</span>
          </div>
        </div>


        <div className="fieldset-caption">Description</div>
        <div className="fieldset">
          <textarea rows="3" className="text-description" {...register("description")}>
            {store.description}
          </textarea>
        </div>

        <div className="fieldset-caption">Capabilities</div>
        <EditCapabilities allowSnapshots={store.allow_snapshots} allowReleases={store.allow_releases} register={register} />

      </div>
      {
        // <ViewJsonDebugger enableDebug={enableDebug} storeJson={storeJson} rawJson={rawJson}
      }
    </form>
  );
}

HostedEdit.propTypes={
  store: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object
};
