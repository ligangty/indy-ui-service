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
import {MemoryRouter} from 'react-router-dom';
import '@testing-library/jest-dom';
import {StoreViewControlPanel, StoreEditControlPanel} from "./StoreControlPanels.jsx";

afterEach(() => {
  cleanup();
});

describe('StoreControlPanels tests', () => {
  it("Verify StoreViewControlPanel with remote", ()=>{
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
      key: "maven:remote:central", disabled: false, "allow_snapshots": true,
      "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
      description: "official maven central"};
    render(<MemoryRouter>
      <StoreViewControlPanel
        store={mockRemoteStore}
      />
    </MemoryRouter>);

    expect(screen.getByRole('button', {name: "Edit"})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "New..."})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "Delete"})).toBeInTheDocument();

    expect(screen.getByRole('button', {name: "Disable"})).toBeInTheDocument();
  });

  it("Verify StoreViewControlPanel with group", ()=>{
    const mockGroup = {name: "public", type: "group", packageType: "maven",
    key: "maven:group:public", disabled: true, description: "public group",
    constituents: ["maven:remote:central", "maven:hosted:local-deployments",]};
    render(<MemoryRouter>
      <StoreViewControlPanel
        store={mockGroup}
      />
    </MemoryRouter>);

    expect(screen.getByRole('button', {name: "Edit"})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "New..."})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "Delete"})).toBeInTheDocument();

    expect(screen.getByRole('button', {name: "Enable"})).toBeInTheDocument();

  });

  it("Verify StoreEditControlPanel of mode edit", ()=>{
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
      key: "maven:remote:central", disabled: false, "allow_snapshots": true,
      "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
      description: "official maven central"};
    render(<MemoryRouter>
      <StoreEditControlPanel
        mode="edit"
        store={mockRemoteStore}
      />
    </MemoryRouter>);

    expect(screen.getByRole('button', {name: "Save"})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "Cancel"})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "Delete"})).toBeInTheDocument();
  });

  it("Verify StoreEditControlPanel of mode new", ()=>{
    const mockRemoteStore = {name: "central", type: "remote", packageType: "maven",
      key: "maven:remote:central", disabled: false, "allow_snapshots": true,
      "allow_releases": true, url: "https://repo.maven.apache.org/maven2/",
      description: "official maven central"};
    render(<MemoryRouter>
      <StoreEditControlPanel
        mode="new"
        store={mockRemoteStore}
      />
    </MemoryRouter>);

    expect(screen.getByRole('button', {name: "Save"})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: "Cancel"})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: "Delete"})).not.toBeInTheDocument();
  });
});
