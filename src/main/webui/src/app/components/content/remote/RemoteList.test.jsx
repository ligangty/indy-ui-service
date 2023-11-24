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

import React from "react";
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from "fetch-mock";
import RemoteList from "./RemoteList.jsx";
import {Utils} from "#utils/AppUtils.js";
import {STORE_API_BASE_URL} from "../../ComponentConstants.js";

beforeEach(()=>{
  fetchMock.restore();
});

afterEach(() => {
  cleanup();
});

describe('RemoteList tests', () => {
  it("Verify RemoteList", async ()=>{
    const mockRemoteStoreList = JSON.stringify({items: [
      {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false, "allow_snapshots": true,
       "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
       description: "official maven central"},
      {name: "mrrc", type: "remote", packageType: "maven",
       key: "maven:remote:mrrc", disabled: false,
       url: "https://maven.repository.redhat.com/ga/",
       description: "Red Hat maven repository"}
    ]});
    const mockDisableTimeout = JSON.stringify({items: [
        {name: "Disable-Timeout", group: "maven:remote:central#Disable-Timeout",
          expiration: "2030-02-22T17:00:00.000Z"},
        {name: "Disable-Timeout", group: "maven:remote:mrrc#Disable-Timeout",
          expiration: "2030-03-22T17:00:00.000Z"}
    ]});
    fetchMock.mock(`${STORE_API_BASE_URL}/maven/remote`, {status: 200, body: JSON.stringify(mockRemoteStoreList)});
    fetchMock.mock("/api/admin/schedule/store/all/disable-timeout", {status: 200, body: JSON.stringify(mockDisableTimeout)});
    render(<MemoryRouter initialEntries={["/remote/maven"]}>
      <Routes>
        <Route path="/remote/:packageType" element={<RemoteList />} />
      </Routes>
    </MemoryRouter>);

    await waitFor(() => {
      // ListControl section testing
      expect(screen.getByRole("button", {name: "New..."})).toBeInTheDocument();

      // StoreListing section testing
      expect(screen.getByRole("link", {name: Utils.storeHref("maven:remote:central")})).toHaveAttribute("href", Utils.storeHref("maven:remote:central"));
      expect(screen.getByRole("link", {name: Utils.storeHref("maven:remote:mrrc")})).toHaveAttribute("href", Utils.storeHref("maven:remote:mrrc"));
    });
  });
});
