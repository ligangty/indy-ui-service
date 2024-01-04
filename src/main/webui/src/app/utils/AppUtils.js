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

/**
 * All functions in this Utils are migrated from old indy UI 1.0, which
 * are used for dedicated purpose in old code. Will check if they are still
 * useful in new UI and and decide if removing some of them.
 */
export const Utils = {
  storeOptions: store => {
    if(store.type==='remote') {
      return Utils.remoteOptions(store);
    }
    if(store.type==='hosted'){
      return Utils.hostedOptions(store);
    }
    return [];
  },
  remoteOptions: store => {
    const options = [];
    if (store.type==="remote"){
      if (store.allow_snapshots){
        options.push({icon: 'S', title: 'Snapshots allowed'});
      }
      if (store.allow_releases){
        options.push({icon: 'R', title: 'Releases allowed'});
      }
    }
    return options;
  },
  hostedOptions: store => {
    const options = [];
    if(store.type === "hosted"){
      if (store.allow_snapshots){
        options.push({icon: 'S', title: 'Snapshots allowed'});
      }
      if (store.allow_releases){
        options.push({icon: 'R', title: 'Releases allowed'});
      }
      if (store.allow_snapshots || store.allow_releases){
        options.push({icon: 'D', title: 'Deployment allowed'});
      }
    }
    return options;
  },
  detailHref: key => {
    const parts = key.split(':');
    return `/${parts[1]}/${parts[0]}/view/${parts[2]}`;
  },
  typeFromKey: key=>{
    const parts = key.split(':');
    return parts[1];
  },
  packageTypeFromKey: key => {
    const parts = key.split(':');
    return parts[0];
  },
  nameFromKey: key => {
    const parts = key.split(':');
    return parts[parts.length-1];
  },
  storeHref: key => {
    const parts = key.split(':');

    let hostAndPort = window.location.hostname;
    if (window.location.port !== '' && window.location.port !== 80 && window.location.port !== 443){
      hostAndPort += ':';
      hostAndPort += window.location.port;
    }
    const proto = window.location.protocol;

    // TODO: In-UI browser that allows simple searching
    return `${proto}//${hostAndPort}/api/content/${parts[0]}/${parts[1]}/${parts[2]}`;
  },
  setDisableMap: listing => {
    const disableMap = {};
    const items = listing.items;
    if (items) {
      for(let i = 0; i<items.length; i++){
        const item = items[i];
        if(item.expiration){
          const parts = item.group.split('#');
          const key = parts[0];
          // console.log("DISABLED: " + key + " (until: " + item.expiration + ")");
          disableMap[key] = item.expiration;
        }
      }
    }
    return disableMap;
  },
  isDisabled: (key, disabledMap) => {
    if(disabledMap && disabledMap.size > 0){
      const result = key in disabledMap;
      return result;
    }
    return false;
  },
  reConstituents: store => {
    const oldConstituents = store.constituents;
    const constituents = [oldConstituents.length];
    for(let j=0; j<oldConstituents.length; j++){
      const key = oldConstituents[j];
      const c = {
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
    const newListing=[];
    rawStoresList.forEach(item=>item.key.toLowerCase().includes(searchString.toLowerCase()) && newListing.push(item));
    return newListing;
  },
  sortByPropForStores: (prop, rawStoresList) => {
    const newListing = rawStoresList.sort((a, b) => {
      if (a[prop] < b[prop]) {
        return -1;
      }
      return 1;
    });
    return newListing;
  },
  isEmptyObj: obj => Object.keys(obj).length === 0 && obj.constructor === Object,
  cloneObj: src => {
    const target = {};
    for (const prop in src) {
      if (prop in src) {
        target[prop] = src[prop];
      }
    }
    return target;
  },
  logMessage: (message, ...params) => {
    const allParams = [message];
    params.forEach(p => allParams.push(p));
    Reflect.apply(console.log, undefined, allParams);
  },
  rewriteTargetObject: (origin, target) => {
    for (const prop in origin) {
      if (origin[prop] !== undefined){
        const val = origin[prop];
        if(typeof val !== 'string' || val.trim() !== ''){
          target[prop] = val;
        }
      }
    }
  },
  sortEndpoints: endpoints => {
    let typeOrder = ['group', 'remote', 'hosted'];
    return endpoints.sort((a, b) => {
      let ta = typeOrder.indexOf(a.type);
      let tb = typeOrder.indexOf(b.type);

      if (ta !== tb){
        return ta < tb ? -1 : 1;
      }

      if (a.packageType < b.packageType){
        return -1;
      }else if (b.packageType < a.packageType){
        return 1;
      }

      if (a.name < b.name){
        return -1;
      }else if (b.name < a.name){
        return 1;
      }

      return 0;
    });
  },
  defaultDescription: description => {
    let desc = description;
    if (!desc || desc.length < 1){
      desc = 'No description provided.';
    }
    return desc;
  }
};
