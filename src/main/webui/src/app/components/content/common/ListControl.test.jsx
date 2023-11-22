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
import ListControl from "./ListControl.jsx";
import {remoteOptionLegend as remoteOptions} from "../../ComponentConstants.js";

afterEach(() => {
  cleanup();
});

describe('ListControl tests', () => {
  it("Verify ListControl by default with remote", ()=>{
    render(<MemoryRouter>
      <ListControl
        type="remote"
        legends={remoteOptions}
        handleSearch={() => {}}
      />
    </MemoryRouter>);
    expect(screen.getByRole("button", {Name: "New..."})).toBeInTheDocument();
    expect(screen.getByText(/Search:/u)).toBeInTheDocument();
    expect(screen.getByText(/Sort by:/u)).toBeInTheDocument();
    expect(screen.getByRole("option", {name: "Remote URL"})).toBeInTheDocument();
    expect(screen.getByText(/Capability Legend:/u)).toBeInTheDocument();
    expect(screen.queryByRole("checkbox", {Name: "enableDebug"})).not.toBeInTheDocument();
  });

  it("Verify ListControl by default with group", ()=>{
    render(<MemoryRouter>
      <ListControl
        type="group"
        handleSearch={() => {}}
        handleDebug={() => {}}
      />
    </MemoryRouter>);

    expect(screen.getByRole("button", {name: "Hide All"})).toBeInTheDocument();
    expect(screen.queryByText(/Sort by:/u)).not.toBeInTheDocument();
    expect(screen.queryByText(/Capability Legend:/u)).not.toBeInTheDocument();
    expect(screen.getByRole("checkbox", {Name: "enableDebug"})).toBeInTheDocument();
  });
});
