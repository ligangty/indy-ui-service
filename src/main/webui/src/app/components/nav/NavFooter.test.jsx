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
import '@testing-library/jest-dom';
import fetchMock from "jest-fetch-mock";
import NavFooter from "./NavFooter.jsx";

beforeEach(() => {
  fetchMock.resetMocks();
});

afterEach(() => {
  cleanup();
});

describe('Footer tests', () => {
  it("Verify Footer for elements existing", async ()=>{
    const mockStats = {
      version: "3.3.2",
      commitId: "f472176",
      builder: "test-builder",
      timestamp: "2023-10-24 05:54 +0000"
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockStats));

    render(<NavFooter />);
    expect(screen.getByRole("link", {name: "Docs"})).toHaveAttribute("href", "http://commonjava.github.io/indy/");
    expect(screen.getByRole("link", {name: "Issues"})).toHaveAttribute("href", "http://github.com/commonjava/indy/issues");
    await waitFor(()=>{
      expect(screen.getByText(`Version:${mockStats.version}`)).toBeInTheDocument();
      expect(screen.getByRole("link", {name: mockStats.commitId})).toHaveAttribute("href", `http://github.com/commonjava/indy/commit/${mockStats.commitId}`);
      expect(screen.getByRole("link", {name: mockStats.builder})).toHaveAttribute("href", `http://github.com/${mockStats.builder}`);
    });

  });
});
