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
import {Link} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {Utils} from '../CompUtils.js';
import ListControl from "./ListControl.jsx";
import {ListJsonDebugger} from './Debugger.jsx';
import {LocalURLSection, StoreNameSection} from './CommonPageWidget.jsx';

const init = function (state, setState){
  useEffect(()=>{
    Utils.getStores(state, setState, "group");
  }, [state.listing]);
};


const createNew = () => {
  // mock
};

const hideAll = () => {
  // mock
};

const handleSearch = (event, rawList, setState) => {
  setState({
    listing: Utils.searchByKeyForNewStores(event.target.value, rawList)
  });
};

const handleDebug = (event, setState) => {
  setState({
    enableDebug: event.target.checked
  });
};

const GroupListItem = ({store, storeClass, disableMap}) => {
  const [hideCons, setHideCons] = useState(true);
  let constituents = store.constituents ? Utils.reConstituents(store) : undefined;
  return (
    <div className="store-listing-item">
      <StoreNameSection store={store} storeClass={storeClass} />
      <div className="fieldset">
        <div>
          <LocalURLSection storeKey={store.key} />
          <div className="options-field field right-half">
            <div className="inline-label">
              {store.constituents && store.constituents.length} Constituent(s) [
              <span className="option">
                {
                  hideCons ?
                  <a href="#" onClick={event => {
                    event.preventDefault();
                    setHideCons(false);
                  }}>+</a> :
                  <a href="#" onClick={event => {
                    event.preventDefault();
                    setHideCons(true);
                  }}>-</a>
                }
              </span>
              ]
            </div>
            {
              !hideCons && constituents &&
                <ol className="content-panel subsection">
                  {
                    constituents.map(item => {
                      let itemStoreClass = Utils.isDisabled(item.key, disableMap)? "disabled-store":"enabled-store";
                      return (
                        <li key={item.key}>
                          <Link to={`/${item.type}/${item.packageType}/view/${item.name}`}>
                              <span className={itemStoreClass}>{item.key}</span>
                          </Link>
                          {
                            item.type==='remote' &&
                              <div className="subfields">
                                <span className="description field">(Remote URL: <a target="_new" href={Utils.storeHref(item.key)}>{Utils.storeHref(item.key)}</a>)</span>
                              </div>
                          }
                        </li>
                      );
                    })
                  }
                </ol>
            }
          </div>
        </div>
        <div className="description field"><span>{store.description}</span></div>
      </div>
    </div>
  );
};

GroupListItem.propTypes={
  store: PropTypes.object.isRequired,
  storeClass: PropTypes.string,
  disableMap: PropTypes.object
};

export default function GroupList() {
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
        useHideAll={true} handleHideAll={hideAll}
        useSearch={true} handleSearch={handleSearch}
        useDebug={true} handleDebug={handleDebug}
        handleCreateNew={createNew} />
      <div className="content-panel">
        <div className="store-listing">
          {
            listing.map(store => {
              let storeClass = Utils.isDisabled(store.key, disMap)? "disabled-store":"enabled-store";
              return (
                <GroupListItem key={store.key} store={store} storeClass={storeClass} disableMap={disMap} />
              );
            })
          }
        </div>
      </div>

      <ListJsonDebugger enableDebug={state.enableDebug} jsonObj={state.listing} />
    </div>
  );
}
