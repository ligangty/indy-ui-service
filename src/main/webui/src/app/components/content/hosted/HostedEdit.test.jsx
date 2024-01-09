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
import HostedEdit from "./HostedEdit.jsx";
import {Filters} from "#utils/Filters.js";
import {STORE_API_BASE_URL} from "../../ComponentConstants.js";

beforeEach(()=>{
  fetchMock.restore();
  fetchMock.mock(
    "/api/stats/package-type/keys",
    {status: 200, body: JSON.stringify(["maven", "npm", "generic-http"])}
  );
});

afterEach(() => {
  cleanup();
});

describe('HostedEdit tests', () => {
  it("Verify HostedEdit for new mode", async ()=>{
    render(<MemoryRouter initialEntries={["/hosted/new"]}>
      <Routes>
        <Route path="/hosted/new" element={<HostedEdit />} />
      </Routes>
    </MemoryRouter>);

    await waitFor(() => {
      // ListControl section testing
      expect(screen.getByRole("button", {name: "Save"})).toBeInTheDocument();
      expect(screen.getByRole("button", {name: "Cancel"})).toBeInTheDocument();

      // Basic section testing
      expect(screen.getByRole("option", {name: "maven"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "npm"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "generic-http"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: ""}).selected).toBe(true);
      expect(screen.getByRole("pkgTypeSel")).toHaveValue("");

      expect(screen.getByText("Name:")).toBeInTheDocument();
      let parentDiv = screen.getByText("Name:").closest("div");
      expect(within(parentDiv).getByRole("textbox")).toHaveAttribute("name", "name");
      expect(screen.getByText("Enabled?")).toBeInTheDocument();
      parentDiv = screen.getByText("Enabled?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "enabled");
      expect(screen.getByText("Readonly?")).toBeInTheDocument();
      parentDiv = screen.getByText("Readonly?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "readonly");
      expect(screen.getByText("Authoritative content Index?")).toBeInTheDocument();
      parentDiv = screen.getByText("Authoritative content Index?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "authoritative_index");
      expect(screen.getByText("Storage Directory:")).toBeInTheDocument();
      parentDiv = screen.getByText("Storage Directory:").closest("div");
      expect(within(parentDiv).getByRole("textbox")).toHaveAttribute("name", "storage");

      // Capabilities section testing
      parentDiv = screen.getByText("Allow Releases").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "allow_releases");
      parentDiv = screen.getByText("Allow Snapshots").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "allow_snapshots");
      expect(screen.getByText("Allow Uploads")).toBeInTheDocument();
    });
  });

  it("Verify HostedEdit for edit mode", async ()=>{
    const mockHostedStore = {name: "local-deployment", type: "hosted", packageType: "maven",
    key: "maven:hosted:local-deployment", disabled: false, storage: "/var/lib/storage",
    "allow_snapshots": true, "allow_releases": true, "authoritative_index": true,
    description: "local deployment repo"};
    const mockDisableTimeout = {name: "Disable-Timeout", group: "maven:hosted:local-deployment#Disable-Timeout",
    expiration: "2030-02-22T17:00:00.000Z"};
    fetchMock.mock(`${STORE_API_BASE_URL}/maven/hosted/local-deployment`, {status: 200, body: JSON.stringify(mockHostedStore)});
    fetchMock.mock("/api/admin/schedule/store/maven/hosted/local-deployment/disable-timeout", {status: 200, body: JSON.stringify(mockDisableTimeout)});
    render(<MemoryRouter initialEntries={["/hosted/maven/edit/local-deployment"]}>
      <Routes>
        <Route path="/hosted/:packageType/edit/:name" element={<HostedEdit />} />
      </Routes>
    </MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText("Package Type:")).toBeInTheDocument();
      expect(screen.getByText(mockHostedStore.packageType, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText(mockHostedStore.name, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Enabled?")).toBeInTheDocument();
      let parentDiv = screen.getByText("Enabled?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "enabled");
      expect(screen.getByText("Readonly?")).toBeInTheDocument();
      parentDiv = screen.getByText("Readonly?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).not.toBeChecked();
      expect(screen.getByText("Authoritative content Index?")).toBeInTheDocument();
      parentDiv = screen.getByText("Authoritative content Index?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toBeChecked();
      expect(screen.getByText("Storage Directory:")).toBeInTheDocument();
      parentDiv = screen.getByText("Storage Directory:").closest("div");
      expect(within(parentDiv).getByRole("textbox")).toHaveValue(mockHostedStore.storage);

      // Capabilities section testing
      parentDiv = screen.getByText("Allow Releases").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toBeChecked();
      parentDiv = screen.getByText("Allow Snapshots").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toBeChecked();
      parentDiv = screen.getByText("Allow Uploads").closest("div");
      expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_releases || mockHostedStore.allow_snapshots))).toBeInTheDocument();
    });
  });
});
