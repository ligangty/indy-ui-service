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

import {jsonGet} from '../RestClient.js';

export const Utils = {
  remoteOptions: store => {
    let options = [];

    if (store.allow_snapshots){
      options.push({icon: 'S', title: 'Snapshots allowed'});
    }

    if (store.allow_releases){
      options.push({icon: 'R', title: 'Releases allowed'});
    }
    return options;
  },
  hostedOptions: store => {
    let options = [];

    if (store.allow_snapshots){
      options.push({icon: 'S', title: 'Snapshots allowed'});
    }

    if (store.allow_releases){
      options.push({icon: 'R', title: 'Releases allowed'});
    }

    if (store.allow_snapshots || store.allow_releases){
      options.push({icon: 'D', title: 'Deployment allowed'});
    }

    return options;
  },
  detailHref: key => {
    let parts = key.split(':');
    return `/${parts[1]}/${parts[0]}/view/${parts[2]}`;
  },
  typeFromKey: key=>{
    let parts = key.split(':');
    return parts[1];
  },
  packageTypeFromKey: key => {
    let parts = key.split(':');
    return parts[0];
  },
  nameFromKey: key => {
    let parts = key.split(':');
    return parts[parts.length-1];
  },
  storeHref: key => {
    let parts = key.split(':');

    let hostAndPort = window.location.hostname;
    if (window.location.port !== '' && window.location.port !== 80 && window.location.port !== 443){
      hostAndPort += ':';
      hostAndPort += window.location.port;
    }
    //
    // let basepath = window.location.pathname;
    // basepath = basepath.replace('/app', '');
    // basepath = basepath.replace(/index.html.*/, '');


    let proto = window.location.protocol;

    // TODO: In-UI browser that allows simple searching
    return `${proto}//${hostAndPort}/api/content/${parts[0]}/${parts[1]}/${parts[2]}`;
  },
  setDisableMap: listing => {
    let disabledMap = {};

    let items = listing.items;
    if (items) {
      for(let i = 0; i<items.length; i++){
        let item = items[i];
        let parts = item.group.split(':');
        let key = parts[0] + ':' + parts[1] + ':' + parts[2];
        // console.log("DISABLED: " + key + " (until: " + item.expiration + ")");
        disabledMap[key] = item.expiration;
      }
    }
    return disabledMap;
  },
  isDisabled: (key, disabledMap) => {
    if(disabledMap && disabledMap.size > 0){
      let result = key in disabledMap;
      return result;
    }
    return false;
  },
  reConstituents: store => {
    let oldConstituents = store.constituents;
    let constituents = [oldConstituents.length];
    for(let j=0; j<oldConstituents.length; j++){
      let key = oldConstituents[j];
      let c = {
          key: oldConstituents[j],
          detailHref: Utils.detailHref(key),
          storeHref: Utils.storeHref(key),
          type: Utils.typeFromKey(key),
          packageType: Utils.packageTypeFromKey(key),
          name: Utils.nameFromKey(key),
      };
      constituents[j] = c;
    }
    return constituents;
  },
  searchByKeyForNewStores: (searchString, rawStoresList)=>{
    let newListing=[];
    rawStoresList.forEach(item=>item.key.toLowerCase().includes(searchString.toLowerCase()) && newListing.push(item));
    return newListing;
  },
  isEmptyObj: obj => Object.keys(obj).length === 0 && obj.constructor === Object,
  cloneObj: src => {
    let target = {};
    for (let prop in src) {
      if (prop in src) {
        target[prop] = src[prop];
      }
    }
    return target;
  },
  logMessage: (message, ...params) => {
    let allParams = [message];
    params.forEach(p => allParams.push(p));
    Reflect.apply(console.log, undefined, allParams);
  },
  // TODO: not used?
  getDisTimeouts: (state, setState, storeType) => {
    jsonGet({
      url: '/api/admin/schedule/store/all/disable-timeout',
      done: response => {
        let disabledMap = Utils.setDisableMap(response, state.listing);
        setState({
          disabledMap
        });
      },
      fail: () => {
        Utils.logMessage(`disable timeout get failed in ${storeType} listing.`);
      }
    });
  },
  // TODO: Not used?
  getStores: (state, setState, storeType) => {
    let url = `/api/admin/stores/_all/${storeType}`;
    jsonGet({
      url,
      done: response => {
        setState({
          listing: response.items,
          rawListing: response.items
        });
        Utils.getDisTimeouts(state, setState);
      },
      fail: errorText => {
        setState({
          message: JSON.parse(errorText).error
        });
      }
    });
  }
};
