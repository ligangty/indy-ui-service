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

import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {PropTypes} from 'prop-types';
import {ListJsonDebugger} from '../common/Debugger.jsx';
import ListControl from "../common/ListControl.jsx";
import {remoteOptionLegend as options, STORE_API_BASE_URL} from "../../ComponentConstants.js";
import {StoreListingWidget} from '../common/StoreListingWidget.jsx';
import {Utils} from '#utils/AppUtils.js';
import {jsonRest} from '#utils/RestClient.js';


const init = (packageType, setState) => {
  useEffect(()=>{
    const fetchdData = async ()=>{
      const response = await jsonRest.get(`${STORE_API_BASE_URL}/${packageType}/remote`);
      if (response.ok){
        const timeoutResponse = await jsonRest.get('/api/admin/schedule/store/all/disable-timeout');
        let disabledMap = {};
        Utils.logMessage(timeoutResponse);
        if (timeoutResponse.ok){
          const timeoutData = await timeoutResponse.json();
          Utils.logMessage(timeoutData);
          disabledMap = Utils.setDisableMap(timeoutData);
        }else{
          timeoutResponse.text().then(data=>Utils.logMessage(`disable timeout get failed in remote listing! Error reason: ${data}`));
        }
        const data = await response.json();
        setState({
          listing: data.items,
          disabledMap
        });
      }else{
        response.text().then(data=>{
          setState({
            message: data
          });
        });
      }
    };
    fetchdData();
  }, [packageType]);
};

const handlers = {
  handleDebug: (event, setState) => {
    setState({
      enableDebug: event.target.checked
    });
  },
  handleSearch: (event, rawList, setState) => {
    setState({
      listing: Utils.searchByKeyForNewStores(event.target.value, rawList)
    });
  }
};

export default function RemoteList() {
  const {packageType} = useParams();
  const [state, setState] = useState({
    listing: [],
    disabledMap: {},
    enableDebug: false,
    message: ''
  });

  init(packageType,setState);
  const listing = state.listing;
  const disMap = state.disabledMap;
  return (
    <div className="container-fluid">
      <ListControl
        type="remote"
        legends={options}
        handleSearch={event => handlers.handleSearch(event, state.listing, setState)}
        handleDebug={event => handlers.handleDebug(event, setState)}
      />
      {
      listing?
      <StoreListingWidget storeList={listing} disableMap={disMap} storeType="remote" />:
      <div className="container-fluid">
        No content fetched!
      </div>
      }
      <ListJsonDebugger enableDebug={state.enableDebug} jsonObj={state.listing} />
    </div>
  );
}
