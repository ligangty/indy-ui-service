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
import {useParams, Link} from 'react-router-dom';
import {StoreViewControlPanel as ControlPanel} from '../common/StoreControlPanels.jsx';
import {StoreViewBasicSection as BasicSection} from '../common/StoreBasicSections.jsx';
import {LoadingSpiner} from '../common/LoadingSpiner.jsx';
// import ViewJsonDebugger from './Debugger.jsx';
import {Utils} from '#utils/AppUtils.js';
import {IndyRest} from '#utils/RestClient.js';

const {storeRes, disableRes} = IndyRest;


export default function GroupView() {
  const [state, setState] = useState({
    store: {},
    raw: {},
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const {packageType, name} = useParams();

  useEffect(()=>{
    setLoading(true);
    (async () => {
      const res = await storeRes.get(packageType, "group", name);
      if (res.success){
        const raw = res.result;
        const store = Utils.cloneObj(raw);
        store.disabled = raw.disabled === undefined ? false : raw.disabled;

        // get Store disablement data
        const timeoutRes = await disableRes.getStoreTimeout(store.packageType, store.type, store.name);
        const newStore = Utils.cloneObj(store);
        if(timeoutRes.success){
          const timeoutData = timeoutRes.result;
          newStore.disableExpiration = timeoutData.expiration;
        }
        // Change state and re-rendering
        setState({
          store: newStore
        });
      }else{
        Utils.logMessage(`Failed to get store data. Error reason: ${res.error.status}->${res.error.message}`);
      }
      setLoading(false);
    })();
  }, [packageType, name]);

  if (loading) {
    return <LoadingSpiner />;
  }

  const store = state.store;
  if(!Utils.isEmptyObj(store)) {
    return (
      <React.Fragment>
        <div className="control-panel">
          <ControlPanel store={store} />
        </div>

        <div className="content-panel">
          <div className="fieldset-caption">Basics</div>
          <BasicSection store={store} />

          <div className="fieldset-caption">Description</div>
          <div className="fieldset">
            <div className="text-field">
              <textarea readOnly className="text-description" value={Utils.defaultDescription(store.description)} />
            </div>
          </div>

          <div className="fieldset-caption">Constituents</div>
            <div className="fieldset">
              {
                store.constituents && store.constituents.length > 0 &&
                <ol className="detail-value detail-value-list">
                  {
                    store.constituents.map(item => <li key={`constituent-${item}`}>
                      <Link to={Utils.detailHref(item)}>{item}</Link>
                    </li>)
                  }
                </ol>
              }
            </div>
        </div>
        {
          // <ViewJsonDebugger enableDebug={false} storeJson={store} rawJson={raw} />
        }
      </React.Fragment>
    );
  }
  return <React.Fragment />;
}
