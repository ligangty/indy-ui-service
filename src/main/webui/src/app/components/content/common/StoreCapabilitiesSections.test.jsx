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
import {render, screen, cleanup, within} from '@testing-library/react';
import '@testing-library/jest-dom';
import {StoreViewCapabilitiesSection} from "./StoreCapabilitiesSections.jsx";
import {Filters} from "#utils/Filters.js";
import {TimeUtils} from "#utils/TimeUtils.js";

afterEach(() => {
  cleanup();
});

describe('StoreCapabilitiesSections tests', () => {
  it("Verify StoreViewCapabilitiesSection for remote repo", ()=>{
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false, "allow_snapshots": false,
       "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
       description: "official maven central"};
    render(<StoreViewCapabilitiesSection store={mockRemoteStore} />);
    let parentDiv = screen.getByText("Allow Releases").closest("div");
    expect(within(parentDiv).getByText(Filters.checkmark(mockRemoteStore.allow_releases))).toBeInTheDocument();
    parentDiv = screen.getByText("Snapshots Allowed?").closest("div");
    expect(within(parentDiv).getByText(Filters.checkmark(mockRemoteStore.allow_snapshots))).toBeInTheDocument();
  });

  it("Verify StoreViewCapabilitiesSection for hosted repo", ()=>{
    const mockHostedStore = {name: "local-deployments", type: "hosted", packageType: "maven",
       key: "maven:hosted:local-deployments", disabled: false, "allow_snapshots": true,
       "allow_releases": false, description: "work for local deployment", snapshotTimeoutSeconds: 3600};
    render(<StoreViewCapabilitiesSection store={mockHostedStore} />);
    let parentDiv = screen.getByText("Allow Uploads").closest("div");
    expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_releases || mockHostedStore.allow_snapshots))).toBeInTheDocument();
    parentDiv = screen.getByText("Allow Releases").closest("div");
    expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_releases))).toBeInTheDocument();
    parentDiv = screen.getByText("Snapshots Allowed?").closest("div");
    expect(within(parentDiv).getByText(Filters.checkmark(mockHostedStore.allow_snapshots))).toBeInTheDocument();
    parentDiv = screen.getByText("Snapshot Timeout:").closest("div");
    expect(within(parentDiv).getByText(`${TimeUtils.secondsToDuration(mockHostedStore.snapshotTimeoutSeconds)}`)).toBeInTheDocument();
  });

  it("Verify StoreViewCapabilitiesSection for group repo", ()=>{
    const mockGroupStore = {name: "public", type: "group", packageType: "maven",
       key: "maven:group:public", disabled: false, description: "public group",
       constituents: ["maven:remote:central", "maven:hosted:local-deployments",]};
    render(<StoreViewCapabilitiesSection store={mockGroupStore} />);
    expect(screen.queryByText("Allow Releases")).not.toBeInTheDocument();
    expect(screen.queryByText("Snapshots Allowed?")).not.toBeInTheDocument();
  });
});
