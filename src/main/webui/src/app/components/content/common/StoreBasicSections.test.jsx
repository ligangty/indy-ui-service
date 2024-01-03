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
import {render, screen, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import {StoreViewBasicSection} from "./StoreBasicSections.jsx";
import {Utils} from "#utils/AppUtils.js";

afterEach(() => {
  cleanup();
});

describe('StoreBasicSections tests', () => {
  it("Verify StoreViewBasicSection for remote repo", ()=>{
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false, "allow_snapshots": true,
       "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
       description: "official maven central"};
    render(<StoreViewBasicSection store={mockRemoteStore} />);
    expect(screen.getByText("Package Type:")).toBeInTheDocument();
    expect(screen.getByText(/\s*maven\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText(/\s*central\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("Make the content index authoritative to this repository")).toBeInTheDocument();

    let storeLocalURL = Utils.storeHref(mockRemoteStore.key);
    expect(screen.getByRole("link", {name: storeLocalURL})).toHaveAttribute("href", storeLocalURL);
    expect(screen.getByRole("link", {name: mockRemoteStore.url})).toHaveAttribute("href", mockRemoteStore.url);

    expect(screen.getByText("Content Cache Timeout:")).toBeInTheDocument();
    expect(screen.getByText("Metadata Cache Timeout:")).toBeInTheDocument();

    expect(screen.getByText("Pre-fetching Priority:")).toBeInTheDocument();
    expect(screen.getByText("Allow Pre-fetching Rescan?")).toBeInTheDocument();
    expect(screen.getByText("Pre-fetching Listing Type:")).toBeInTheDocument();
  });

  it("Verify StoreViewBasicSection for hosted repo", ()=>{
    const mockHostedStore = {name: "local-deployments", type: "hosted", packageType: "maven",
       key: "maven:hosted:local-deployments", disabled: false, readonly: false, "allow_snapshots": true,
       "allow_releases": true, description: "work for local deployment",
        storage: "/var/lib/teststorage"};
    render(<StoreViewBasicSection store={mockHostedStore} />);
    expect(screen.getByText("Package Type:")).toBeInTheDocument();
    expect(screen.getByText(/\s*maven\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText(/\s*local-deployments\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("If set to readonly, all uploading and deleting operations to this repo are prohibited")).toBeInTheDocument();

    expect(screen.getByText("Make the content index authoritative to this repository (when readonly, this will be enabled automatically)")).toBeInTheDocument();

    const storeLocalURL = Utils.storeHref(mockHostedStore.key);
    expect(screen.getByRole("link", {name: storeLocalURL})).toHaveAttribute("href", storeLocalURL);

    expect(screen.queryByText("Content Cache Timeout:")).not.toBeInTheDocument();
    expect(screen.queryByText("Metadata Cache Timeout:")).not.toBeInTheDocument();

    expect(screen.queryByText("Pre-fetching Priority:")).not.toBeInTheDocument();
    expect(screen.queryByText("Allow Pre-fetching Rescan?")).not.toBeInTheDocument();
    expect(screen.queryByText("Pre-fetching Listing Type:")).not.toBeInTheDocument();

    expect(screen.getByText("/var/lib/teststorage")).toBeInTheDocument();
  });

  it("Verify StoreViewBasicSection for group repo", ()=>{
    const mockGroupStore = {name: "public", type: "group", packageType: "maven",
       // eslint-disable-next-line camelcase
       key: "maven:group:public", disabled: false, prepend_constituent: false,
       description: "public group", constituents: ["maven:remote:central", "maven:hosted:local-deployments",]};
    render(<StoreViewBasicSection store={mockGroupStore} />);
    expect(screen.getByText("Package Type:")).toBeInTheDocument();
    expect(screen.getByText(/\s*maven\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText(/\s*public\s*$/u, {selector: "span"})).toBeInTheDocument();

    expect(screen.getByText("If enabled, all new constituents which are added not manually(like promotion) will be at the top of constituents list")).toBeInTheDocument();

    const storeLocalURL = Utils.storeHref(mockGroupStore.key);
    expect(screen.getByRole("link", {name: storeLocalURL})).toHaveAttribute("href", storeLocalURL);

    expect(screen.queryByText("Content Cache Timeout:")).not.toBeInTheDocument();
    expect(screen.queryByText("Metadata Cache Timeout:")).not.toBeInTheDocument();

    expect(screen.queryByText("Pre-fetching Priority:")).not.toBeInTheDocument();
    expect(screen.queryByText("Allow Pre-fetching Rescan?")).not.toBeInTheDocument();
    expect(screen.queryByText("Pre-fetching Listing Type:")).not.toBeInTheDocument();
  });
});
