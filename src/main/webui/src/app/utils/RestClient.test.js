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

import fetchMock from "fetch-mock";
import {IndyRest, BASE_STORE_API_PATH} from "./RestClient.js";

beforeEach(()=>{

});

afterEach(() => {
  fetchMock.restore();
});

describe('IndyRest test', () => {
  it('Check get store: normal case', async () => {
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
      key: "maven:remote:central", disabled: false, "allow_snapshots": true,
      "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
      description: "official maven central"};
    fetchMock.mock(`${BASE_STORE_API_PATH}/maven/remote/central`, {status: 200, body: JSON.stringify(mockRemoteStore)});
    const res = await IndyRest.storeRes.get("maven", "remote", "central");
    expect(res.success).toBe(true);
    expect(res.result).toEqual(mockRemoteStore);
  });
  it('Check get store: not exists', async () => {
    fetchMock.mock(`${BASE_STORE_API_PATH}/maven/remote/central`, {status: 404});
      const result = await IndyRest.storeRes.get("maven", "remote", "central");
      expect(result.success).toBe(false);
      expect(result.error).toEqual({status: 404, message: "Not Found"});
  });
  it('Check get store: error with json body', async () => {
    fetchMock.mock(`${BASE_STORE_API_PATH}/maven/remote/central`, {status: 500, body: JSON.stringify({error: "Mock internal error"})});
      const result = await IndyRest.storeRes.get("maven", "remote", "central");
      expect(result.success).toBe(false);
      expect(result.error).toEqual({status: 500, message: "Mock internal error"});
  });
});
