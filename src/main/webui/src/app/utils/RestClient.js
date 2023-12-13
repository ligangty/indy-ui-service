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

const logErrors = response => {
  if(response.text()){
    response.text().then(error=>console.log(error));
  }else{
    console.log(`Something wrong: ${response.status} -> ${response.statusText}`);
  }
};

export {http, jsonRest, logErrors};
