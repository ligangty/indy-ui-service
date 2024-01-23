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
import {render, screen, cleanup, waitFor, within} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import fetchMock from "fetch-mock";
import NFC from "./NFC.jsx";

beforeEach(()=>{
  fetchMock.restore();
});

afterEach(() => {
  cleanup();
});

const mockEndpoints = {items: [
  {
    "packageType": "maven",
    "name": "central",
    "type": "remote",
    "key": "maven:remote:central",
    "storeKey": "maven:remote:central",
    "storeType": "remote",
    "resource_uri": "http://localhost:4000/api/content/maven/remote/central"
  },
  {
    "packageType": "maven",
    "name": "public",
    "type": "group",
    "key": "maven:group:public",
    "storeKey": "maven:group:public",
    "storeType": "group",
    "resource_uri": "http://localhost:4000/api/content/maven/group/public"
  },
  {
    "packageType": "maven",
    "name": "tYMtROxQUA",
    "type": "hosted",
    "key": "maven:hosted:tYMtROxQUA",
    "storeKey": "maven:hosted:tYMtROxQUA",
    "storeType": "hosted",
    "resource_uri": "http://localhost:4000/api/content/maven/hosted/tYMtROxQUA"
  }
]};

const mockAllNFCItems = {
  sections: [
    {
      "key": "maven:remote:central",
      "paths": [
        "/8852/5330",
        "/5687/5449",
        "/6781/5509"
      ]
    },
    {
      "key": "maven:group:public",
      "paths": [
        "/5071/7765",
        "/9606/6819",
        "/9647/3899",
        "/2185/2201"
      ]
    },
    {
      "key": "maven:hosted:tYMtROxQUA",
      "paths": [
        "/4960/9412",
        "/1687/3470",
        "/2960/4280",
        "/1140/8242",
        "/8854/5915",
        "/9425/1833",
        "/8009/6333",
        "/7481/6826",
        "/3495/8758"
      ]
    }
  ]
};

describe('NFC tests', () => {
  it("Verify NFC", async () => {
    const user = userEvent.setup();
    fetchMock.mock(`/api/admin/stores/query/endpoints/all`, {status: 200, body: JSON.stringify(mockEndpoints)});
    fetchMock.mock("/api/nfc?pageIndex=0&pageSize=10", {status: 200, body: JSON.stringify(mockAllNFCItems)});
    render(<NFC />);
    const nfcSelect = screen.getByRole("nfcSel");
    await waitFor(() => {
      expect(nfcSelect).toHaveValue("");
    });
    const showAllButton = screen.getByRole("button", {name: "Show All"});

    await waitFor(() => {
      expect(screen.getByRole("option", {name: "central (remote; maven)"})).toBeInTheDocument();
      expect(showAllButton).toBeInTheDocument();
    });

    await user.click(showAllButton);
    await waitFor(() => {
      let section = screen.getByRole("section-maven:remote:central");
      expect(section).toBeInTheDocument();
      expect(within(section).getByText("/8852/5330")).toBeInTheDocument();

      section = screen.getByRole("section-maven:group:public");
      expect(section).toBeInTheDocument();
      expect(within(section).getByText("/5071/7765")).toBeInTheDocument();

      section = screen.getByRole("section-maven:hosted:tYMtROxQUA");
      expect(section).toBeInTheDocument();
      expect(within(section).getByText("/9425/1833")).toBeInTheDocument();
    });
  });
});
