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
import {LocalURLSection,
   CapabilitiesSection,
   StoreNameSection,
   StoreListingWidget} from "./StoreListingWidget.jsx";
import {hostedOptionLegend} from '../../ComponentConstants.js';

afterEach(() => {
  cleanup();
});

describe('StoreListingWidget tests', () => {
  it("Verify LocalURLSection", () => {
    render(<LocalURLSection storeKey="maven:remote:central"/>);
    const keyLink = screen.getByRole("link");
    expect(keyLink).toBeInTheDocument();
    const urlPat = /https?:\/\/.*\/maven\/remote\/central$/ui;
    expect(keyLink.href).toMatch(urlPat);
    expect(screen.getByText(urlPat)).toBeInTheDocument();
  });

  it("Verify CapabilitiesSection",()=>{
    render(<CapabilitiesSection options={hostedOptionLegend}/>);
    expect(screen.getByText(/\s*S\s*/u)).toBeInTheDocument();
    expect(screen.getByText(/\s*R\s*/u)).toBeInTheDocument();
    expect(screen.getByText(/\s*D\s*/u)).toBeInTheDocument();
  });

  it("Verify StoreNameSection", ()=>{
    // As <Link> is in <StoreNameSection>, needs to use a Router to wrap it
    render(<MemoryRouter>
      <StoreNameSection
       store={{packageType: "maven", type: "remote", name: "central"}}
       storeClass="test-style"/>
    </MemoryRouter>);
    expect(screen.getByText(/maven-central/u)).toBeInTheDocument();
  });

  it("Verify StoreListingWidget", ()=>{
    const mockRemoteStoreList = [
      {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false,
       url: "https://repo.maven.apache.org/maven2/",
       description: "official maven central"},
      {name: "mrrc", type: "remote", packageType: "maven",
       key: "maven:remote:mrrc", disabled: false,
       url: "https://maven.repository.redhat.com/ga/",
       description: "Red Hat maven repository"},
    ];
    const mockDisableMap = {};
    render(<MemoryRouter>
    <StoreListingWidget storeList={mockRemoteStoreList} disableMap={mockDisableMap} storeType="remote"/>
    </MemoryRouter>);
    expect(screen.getByText(/https:\/\/repo.maven.apache.org\/maven2\//u)).toBeInTheDocument();
    expect(screen.getByText(/official maven central/u)).toBeInTheDocument();
    expect(screen.getByText(/https:\/\/maven.repository.redhat.com\/ga\//u)).toBeInTheDocument();
    expect(screen.getByText(/Red Hat maven repository/u)).toBeInTheDocument();
  });
});
