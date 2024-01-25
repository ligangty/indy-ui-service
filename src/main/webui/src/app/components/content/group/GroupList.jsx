/**
 * Copyright (C) 2024 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
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

import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ListJsonDebugger} from "../common/Debugger.jsx";
import ListControl from "../common/ListControl.jsx";
import {groupOptionLegend as options} from "../../ComponentConstants.js";
import {StoreListingWidget} from "../common/StoreListingWidget.jsx";
import {LoadingSpiner} from "../common/LoadingSpiner.jsx";
import {Utils} from "#utils/AppUtils.js";
import {IndyRest} from "#utils/RestClient.js";

const {storeRes, disableRes} = IndyRest;

const handlers = {
  handleDebug: (event, setState) => {
    setState({
      enableDebug: event.target.checked,
    });
  },
  handleSearch: (event, rawList, setState) => {
    setState({
      rawList,
      listing: Utils.searchByKeyForNewStores(event.target.value, rawList),
    });
  },
  handleSortBy: (event, rawList, setState) => {
    setState({
      rawList,
      listing: Utils.sortByPropForStores(event.target.value, rawList),
    });
  },
};

export default function GroupList() {
  const {packageType} = useParams();
  const [state, setState] = useState({
    rawList: [],
    listing: [],
    disabledMap: {},
    enableDebug: false,
    message: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (async () => {
      const res = await storeRes.getStores(packageType, "group");
      if (res.success) {
        const timeoutRes = await disableRes.getAllStoreTimeout();
        let disabledMap = {};
        if (timeoutRes.success) {
          const timeoutData = timeoutRes.result;
          disabledMap = Utils.setDisableMap(timeoutData);
        } else {
          Utils.logMessage(`disable timeout get failed in group listing! Error reason: ${timeoutRes.error.message}`,);
        }
        let data = res.result;
        if (typeof data === "string") {
          data = JSON.parse(data);
        }
        setState({
          rawList: data.items,
          listing: data.items,
          disabledMap,
        });
      } else {
        setState({
          message: res.error.message,
        });
      }
      setLoading(false);
    })();
  }, [packageType]);

  if (loading) {
    return <LoadingSpiner />;
  }

  return (
    <React.Fragment>
      <ListControl
        type="group"
        legends={options}
        handleSearch={event => handlers.handleSearch(event, state.rawList, setState)
        }
        handleDebug={event => handlers.handleDebug(event, setState)}
        handleSortBy={event => handlers.handleSortBy(event, state.rawList, setState)
        }
      />
      {state.listing ?
        <StoreListingWidget
          storeList={state.listing}
          disableMap={state.disabledMap}
          storeType="group"
        />
       :
        <div className="container-fluid">No content fetched!</div>
      }
      <ListJsonDebugger
        enableDebug={state.enableDebug}
        jsonObj={state.listing}
      />
    </React.Fragment>
  );
}
