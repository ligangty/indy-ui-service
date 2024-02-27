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
import {MemoryRouter} from 'react-router-dom';
import {render, screen, cleanup} from '@testing-library/react';
import '@testing-library/jest-dom';
import {StoreListingWidget} from "./StoreListingWidget.jsx";
import {Utils} from "#utils/AppUtils.js";

afterEach(() => {
  cleanup();
});

describe('StoreListingWidget tests', () => {
  it("Verify StoreListingWidget", ()=>{
    const mockRemoteStoreList = [
      {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false, "allow_snapshots": true,
       "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
       description: "official maven central"},
      {name: "mrrc", type: "remote", packageType: "maven",
       key: "maven:remote:mrrc", disabled: false,
       url: "https://maven.repository.redhat.com/ga/",
       description: "Red Hat maven repository"},
    ];
    render(<MemoryRouter>
    <StoreListingWidget storeList={mockRemoteStoreList} storeType="remote"/>
    </MemoryRouter>);

    // Testing LocalURLSection
    const generatedLocalURL= Utils.storeHref("maven:remote:central");
    const localUrlElem = screen.getByRole("link", {name: generatedLocalURL});
    expect(localUrlElem).toBeInTheDocument();
    expect(localUrlElem).toHaveAttribute("href", generatedLocalURL);

    // Testing CapabilitiesSection
    expect(screen.getByText(/\s*S\s*$/u, {selector: "span"})).toBeInTheDocument();
    expect(screen.getByText(/\s*R\s*$/u, {selector: "span"})).toBeInTheDocument();

    // Testing StoreNameSection
    expect(screen.getByText(/maven-central/u, {selector: "span"})).toBeInTheDocument();
    expect(screen.getByText(/maven-mrrc/u, {selector: "span"})).toBeInTheDocument();

    // Testing other parts in StoreListingWidget
    expect(screen.getByText(/https:\/\/repo.maven.apache.org\/maven2\//u)).toBeInTheDocument();
    expect(screen.getByText(/official maven central/u)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/maven.repository.redhat.com\/ga\//u)).toBeInTheDocument();
    expect(screen.getByText(/Red Hat maven repository/u)).toBeInTheDocument();
  });
});
