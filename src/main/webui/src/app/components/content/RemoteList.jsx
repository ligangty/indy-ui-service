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

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {ListJsonDebugger} from './Debugger.jsx';
import ListControl from "./ListControl.jsx";
import {remoteOptionLegend as options} from "../ComponentConstants.js";
import {Utils} from '../CompUtils.js';
import {StoreListingWidget} from './CommonPageWidget.jsx';

const init = (state, setState) => {
  useEffect(()=>{
    const fetchdData = async ()=>{
      let isError = false;
      const response = await axios.get(`/api/admin/stores/_all/remote`).catch(error=>{
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
        const timeoutResponse = await axios.get('/api/admin/schedule/store/all/disable-timeout').catch(error=>{
          isError=true;
          Utils.logMessage(`disable timeout get failed in remote listing! Error reason: ${error}`);
        });
        let disabledMap = {};
        if (!isError){
          disabledMap = Utils.setDisableMap(timeoutResponse.data, state.listing);
        }
        setState({
          listing: response.data.items,
          rawListing: response.data.items,
          disabledMap
        });
      }
    };
    fetchdData();
  }, []);
};

const handlers = {
  createNew: () => {
    // mock
  },
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
  const [state, setState] = useState({
    listing: [],
    rawListing: [],
    disabledMap: {},
    enableDebug: false,
    message: ''
  });

  init(state, setState);
  // Utils.logMessage(state);
  let listing = state.listing;
  let disMap = state.disabledMap;
  let orderBys = [
    {value: 'key', text: 'Name'},
    {value: 'url', text: 'Remote URL'}
  ];
  return (
    <div className="container-fluid">
      <ListControl
        useSearch={true} handleSearch={event => handlers.handleSearch(event, state.rawListing, setState)}
        useOrderBy={true} orderBys={orderBys}
        useLegend={true} legends={options}
        useDebug={true} handleDebug={event => handlers.handleDebug(event, setState)}
        handleCreateNew={handlers.createNew} />
      {
      listing?
      <StoreListingWidget StoreList={listing} DisMap={disMap} StoreType="remote" />:
      <div className="container-fluid">
        No content fetched!
      </div>
      }
      <ListJsonDebugger enableDebug={state.enableDebug} jsonObj={state.listing} />
    </div>
  );
}
