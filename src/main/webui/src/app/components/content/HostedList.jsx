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
import ListControl from "./ListControl.jsx";
import {ListJsonDebugger} from './Debugger.jsx';
import {Utils} from '../CompUtils.js';
import {hostedOptionLegend as options} from "../ComponentConstants.js";
import {StoreListingWidget} from './CommonPageWidget.jsx';


const init = (state, setState) => {
  useEffect(()=>{
    Utils.getStores(state, setState, "hosted");
  }, [state.listing]);
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

export default function HostedList() {
  const [state, setState] = useState({
    listing: [],
    rawListing: [],
    disabledMap: {},
    enableDebug: false,
    message: ''
  });

  init(state, setState);
  let listing = state.listing;
  let disMap = state.disabledMap;

  return (
    <div className="container-fluid">
      <ListControl
        useSearch={true} handleSearch={event => handlers.handleSearch(event, state.rawListing, setState)}
        useLegend={true} legends={options}
        useDebug={true} handleDebug={event => handlers.handleDebug(event, setState)}
        handleCreateNew={handlers.createNew} />
      <StoreListingWidget StoreList={listing} DisMap={disMap} StoreType="hosted" />
      <ListJsonDebugger enableDebug={state.enableDebug} jsonObj={state.listing} />
    </div>
  );
}
