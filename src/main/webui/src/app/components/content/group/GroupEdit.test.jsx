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
/* eslint-disable camelcase */
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

import React from "react";
import {MemoryRouter, Route, Routes} from 'react-router-dom';
import {render, screen, cleanup, waitFor, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import fetchMock from "fetch-mock";
import GroupEdit from "./GroupEdit.jsx";
import {STORE_API_BASE_URL} from "../../ComponentConstants.js";

beforeEach(() => {
  fetchMock.restore();
  fetchMock.mock(
    "/api/stats/package-type/keys",
    {status: 200, body: JSON.stringify(["maven", "npm", "generic-http"])}
  );
});

afterEach(() => {
  cleanup();
});

describe('GroupEdit tests', () => {
  it("Verify GroupEdit for new mode", async () => {
    const mockAvailable = {
      "items": [
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "storeKey": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-parent-4-x_20180515.1724"
        },
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "storeKey": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-parent-4-x_20180531.0218"
        },
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "storeKey": "maven:group:build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216"
        },
        {
          "packageType": "maven",
          "name": "build_vertx-infinispan-3-5-1_20180705.1313",
          "type": "group",
          "key": "maven:group:build_vertx-infinispan-3-5-1_20180705.1313",
          "storeKey": "maven:group:build_vertx-infinispan-3-5-1_20180705.1313",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_vertx-infinispan-3-5-1_20180705.1313"
        },
        {
          "packageType": "maven",
          "name": "public",
          "type": "group",
          "key": "maven:group:public",
          "storeKey": "maven:group:public",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/public"
        }
      ]
    };
    fetchMock.mock(`/api/admin/stores/query/endpoints/all`, {status: 200, body: JSON.stringify(mockAvailable)});
    render(<MemoryRouter initialEntries={["/group/new"]}>
      <Routes>
        <Route path="/group/new" element={<GroupEdit />} />
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
      expect(screen.getByText("Prepend Constituents?")).toBeInTheDocument();
      parentDiv = screen.getByText("Prepend Constituents?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "prepend_constituent");
      expect(screen.getByText("Current:")).toBeInTheDocument();
      expect(screen.getByText("Available:")).toBeInTheDocument();
    });
  });

  it("Verify GroupEdit for edit mode", async () => {
    const mockGroupStore = {
      name: "local-deployment", type: "group", packageType: "maven",
      key: "maven:group:local-deployment", disabled: false,
      "allow_snapshots": true, "allow_releases": true,
      description: "local deployment repo",
      constituents: ["maven:remote:central", "maven:hosted:local-deployment"]
    };
    const mockAvailable = {
      "items": [
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "storeKey": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180515.1724",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-parent-4-x_20180515.1724"
        },
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "storeKey": "maven:group:build_org-keycloak-keycloak-parent-4-x_20180531.0218",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-parent-4-x_20180531.0218"
        },
        {
          "packageType": "maven",
          "name": "build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "type": "group",
          "key": "maven:group:build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "storeKey": "maven:group:build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_org-keycloak-keycloak-nodejs-auth-utils-3-xnpm_1-2-stage-4_20180104.1216"
        },
        {
          "packageType": "maven",
          "name": "build_vertx-infinispan-3-5-1_20180705.1313",
          "type": "group",
          "key": "maven:group:build_vertx-infinispan-3-5-1_20180705.1313",
          "storeKey": "maven:group:build_vertx-infinispan-3-5-1_20180705.1313",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/build_vertx-infinispan-3-5-1_20180705.1313"
        },
        {
          "packageType": "maven",
          "name": "public",
          "type": "group",
          "key": "maven:group:public",
          "storeKey": "maven:group:public",
          "storeType": "group",
          "resource_uri": "http://localhost:4000/api/content/maven/group/public"
        }
      ]
    };
    const mockDisableTimeout = {
      name: "Disable-Timeout", group: "maven:group:local-deployment#Disable-Timeout",
      expiration: "2030-02-22T17:00:00.000Z"
    };
    fetchMock.mock(`${STORE_API_BASE_URL}/maven/group/local-deployment`, {status: 200, body: JSON.stringify(mockGroupStore)});
    fetchMock.mock(`/api/admin/stores/query/endpoints/maven`, {status: 200, body: JSON.stringify(mockAvailable)});
    fetchMock.mock("/api/admin/schedule/store/maven/group/local-deployment/disable-timeout", {status: 200, body: JSON.stringify(mockDisableTimeout)});
    render(<MemoryRouter initialEntries={["/group/maven/edit/local-deployment"]}>
      <Routes>
        <Route path="/group/:packageType/edit/:name" element={<GroupEdit />} />
      </Routes>
    </MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText("Package Type:")).toBeInTheDocument();
      expect(screen.getByText(mockGroupStore.packageType, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Name:")).toBeInTheDocument();
      expect(screen.getByText(mockGroupStore.name, {selector: "span"})).toBeInTheDocument();
      expect(screen.getByText("Enabled?")).toBeInTheDocument();
      let parentDiv = screen.getByText("Enabled?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "enabled");
      expect(screen.getByText("Prepend Constituents?")).toBeInTheDocument();
      parentDiv = screen.getByText("Prepend Constituents?").closest("div");
      expect(within(parentDiv).getByRole("checkbox")).toHaveAttribute("name", "prepend_constituent");
      expect(screen.getByText("Current:")).toBeInTheDocument();
      expect(screen.getByText("Available:")).toBeInTheDocument();

    });
  });
});
