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
import {render, screen, cleanup, waitFor} from '@testing-library/react';
import fetchMock from "fetch-mock";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import {PackageTypeSelect} from "./PackageTypeSelect.jsx";

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

describe('PackageTypeSelect tests', () => {
  it("Verify PackageTypeSelect by default", async ()=>{
    render(<PackageTypeSelect />);
    await waitFor(()=>{
      expect(screen.getByRole("option", {name: "maven"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "npm"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "generic-http"})).toBeInTheDocument();

      expect(screen.getByRole("option", {name: "maven"}).selected).toBe(true);
      expect(screen.getByRole("combobox")).toHaveValue("maven");
    });
  });

  it("Verify PackageTypeSelect for npm selected", async ()=>{
    render(<PackageTypeSelect packageType="npm" />);
    await waitFor(()=>{
      expect(screen.getByRole("option", {name: "maven"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "npm"})).toBeInTheDocument();
      expect(screen.getByRole("option", {name: "generic-http"})).toBeInTheDocument();

      expect(screen.getByRole("combobox")).toHaveValue("npm");
      expect(screen.getByRole("option", {name: "npm"}).selected).toBe(true);
    });
  });

  it("Verify PackageTypeSelect for value change", async ()=>{
    const {selectOptions} = userEvent.setup();
    let value = "";
    const vauleChangeHandler = e => {
      value = e.target.value;
    };
    render(<PackageTypeSelect vauleChangeHandler={vauleChangeHandler}/>);
    expect(value).toBe("");
    await waitFor(() => {
      expect(screen.getByRole("option", {name: "maven"}).selected).toBe(true);
      expect(screen.getByRole("option", {name: "npm"})).toBeInTheDocument();
      selectOptions(screen.getByRole("combobox"), "npm");
      expect(value).toBe("npm");
    });
  });

});
