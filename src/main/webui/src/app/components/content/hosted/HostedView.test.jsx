/* eslint-disable camelcase */
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
import {render, screen, cleanup, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from "fetch-mock";
import HostedView from "./HostedView.jsx";
import {Filters} from "#utils/Filters.js";
import {STORE_API_BASE_URL} from "../../ComponentConstants.js";

beforeEach(()=>{
  fetchMock.restore();
});

afterEach(() => {
  cleanup();
});

describe('HostedView tests', () => {
  it("Verify HostedView", async ()=>{
    const mockHostedStore = {name: "local-deployment", type: "hosted", packageType: "maven",
    key: "maven:hosted:local-deployment", disabled: false, storage: "/var/lib/storage",
    "allow_snapshots": true, "allow_releases": true,
    description: "local deployment repo"};
    const mockDisableTimeout = {name: "Disable-Timeout", group: "maven:hosted:local-deployment#Disable-Timeout",
    expiration: "2030-02-22T17:00:00.000Z"};
    fetchMock.mock(`${STORE_API_BASE_URL}/maven/hosted/local-deployment`, {status: 200, body: JSON.stringify(mockHostedStore)});
    fetchMock.mock("/api/admin/schedule/store/maven/hosted/local-deployment/disable-timeout", {status: 200, body: JSON.stringify(mockDisableTimeout)});
    render(<MemoryRouter initialEntries={["/hosted/maven/view/local-deployment"]}>
      <Routes>
        <Route path="/hosted/:packageType/view/:name" element={<HostedView />} />
      </Routes>
    </MemoryRouter>);

    await waitFor(() => {
      // Control section testing
      expect(screen.getByRole("button", {name: "New..."})).toBeInTheDocument();

      // StoreView: Basic section testing
      expect(screen.getByText("Package Type:")).toBeInTheDocument();
      expect(screen.getByText(mockHostedStore.packageType, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText(mockHostedStore.name, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Alternative Storage Directory:")).toBeInTheDocument();
      expect(screen.getByText(mockHostedStore.storage, {selector: "span"})).toBeInTheDocument();

      // StoreView: Capabilities section testing
      let parentDiv = screen.getByText("Allow Releases").closest("div");
      expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_releases))).toBeInTheDocument();
      parentDiv = screen.getByText("Snapshots Allowed?").closest("div");
      expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_snapshots))).toBeInTheDocument();
      parentDiv = screen.getByText("Allow Uploads").closest("div");
      expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_releases || mockHostedStore.allow_snapshots))).toBeInTheDocument();
    });
  });
});
