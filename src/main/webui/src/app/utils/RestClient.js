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

const httpCall = (url, method, headers={}, payload) => fetch(url, {
  method,
  credentials: 'same-origin',
  headers,
  body: payload? payload : undefined
});

const http = {
  get: (url, headers, payload) => httpCall(url, "GET", headers, payload),
  post: (url, headers, payload) => httpCall(url, "POST", headers, payload),
  put: (url, headers, payload) => httpCall(url, "PUT", headers, payload),
  delete: (url, headers, payload) => httpCall(url, "DELETE", headers, payload)
};

const jsonRest ={
  get: (url, payload) => httpCall(url, "GET", {"Content-type": "application/json"}, JSON.stringify(payload)),
  post: (url, payload) => httpCall(url, "POST", {"Content-type": "application/json"}, JSON.stringify(payload)),
  put: (url, payload) => httpCall(url, "PUT", {"Content-type": "application/json"}, JSON.stringify(payload))
};

// const logErrors = response => {
//   if(response.text()){
//     response.text().then(error=>console.log(error));
//   }else{
//     console.log(`Something wrong: ${response.status} -> ${response.statusText}`);
//   }
// };

const BASE_API_PATH = "/api/admin/stores";
const storeAPIEndpoint = (pkgType, type, name) => `${BASE_API_PATH}/${pkgType}/${type}/${name}`;

const handleResponse = async response => {
  if (response.ok){
    let result = {};
    try {
      result = await response.json();
    }catch(e){
      // no response body, do nothing
    }
    return {result, success: true};
  }
  try {
    const responseData = await response.json();
    if(responseData){
      return {success: false, error: {status: response.status, message: responseData.error}};
    }
  }catch(e) {
    // no response body, do nothing
  }
  return {success: false, error: {status: response.status, message: response.statusText}};
};
const IndyRest = {
  statsRes: {
    getAllPkgTypes: async () =>{
      const response = await jsonRest.get('/api/stats/package-type/keys');
      return handleResponse(response);
    },
    getVersion: async () =>{
      const response = await jsonRest.get(`/api/stats/version-info`);
      return handleResponse(response);
    }
  },
  storeRes: {
    get: async (pkgType, type, name) => {
      // get Store data
      const response = await jsonRest.get(storeAPIEndpoint(pkgType, type, name));
      return handleResponse(response);
    },
    create: async store => {
      const response = await jsonRest.post(storeAPIEndpoint(store.packageType, store.type, store.name), store);
      return handleResponse(response);
    },
    update: async store => {
      // update Store data
      const response = await jsonRest.put(storeAPIEndpoint(store.packageType, store.type, store.name), store);
      return handleResponse(response);
    },
    delete: async (pkgType, type, name) => {
      const response = await http.delete(storeAPIEndpoint(pkgType, type, name));
      return handleResponse(response);
    },
    getStores: async (pkgType, type) => {
      const response = await jsonRest.get(`${BASE_API_PATH}/${pkgType}/${type}`);
      return handleResponse(response);
    }
  },
  contentRes: {
    browse: async dirPath => {
      const response = await jsonRest.get(`/api${dirPath}`);
      return handleResponse(response);
    },
    delete: async contentPath => {
      const response = await http.delete(`${contentPath}?cache-only=true`);
      return handleResponse(response);
    },
  },
  disableRes: {
    getAllStoreTimeout: async () => {
      const response = await jsonRest.get('/api/admin/schedule/store/all/disable-timeout');
      return handleResponse(response);
    },
    getStoreTimeout: async (pkgType, type, name) => {
      const response = await jsonRest.get(`/api/admin/schedule/store/${pkgType}/${type}/${name}/disable-timeout`);
      if (response.ok){
        const stores = await response.json();
        return {result: stores, success: true};
      }
      const responseMsg = await response.text();
      if(responseMsg){
        return {success: false, error: {status: response.status, message: responseMsg}};
      }
      return {success: false, error: {status: response.status, message: response.statusText}};
    }
  },
  nfcRes: {
      // TODO: not implemented.
  },
};

export {IndyRest, BASE_API_PATH};
