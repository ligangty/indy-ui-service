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
import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import {URLPage} from "./DirectoryListing";

const mockData = {
  "storeKey": "maven:remote:central",
  "parentUrl": "http://localhost/api/browse/maven/remote/central/",
  "parentPath": "/",
  "path": "ant/",
  "storeBrowseUrl": "http://localhost/api/browse/maven/remote/central",
  "storeContentUrl": "http://localhost/api/content/maven/remote/central",
  "baseBrowseUrl": "http://localhost/api/browse/maven",
  "baseContentUrl": "http://localhost/api/content/maven",
  "sources": ["http://localhost/api/browse/maven/remote/central"],
  "listingUrls": [
    {
      "path": "/ant/ant-junit/",
      "listingUrl": "http://localhost/api/browse/maven/remote/central/ant/ant-junit/",
      "sources": ["https://repo.maven.apache.org/maven2/ant/ant-junit/"]
    }, {
      "path": "/ant/ant-launcher/",
      "listingUrl": "http://localhost/api/browse/maven/remote/central/ant/ant-launcher/",
      "sources": ["https://repo.maven.apache.org/maven2/ant/ant-launcher/"]
    }, {
      "path": "/ant/ant-nodeps/",
      "listingUrl": "http://localhost/api/browse/maven/remote/central/ant/ant-nodeps/",
      "sources": ["https://repo.maven.apache.org/maven2/ant/ant-nodeps/"]
    }
  ]
};

describe("DirectoryListing Component testing in conent-browse", () => {
  it("URLPage component rendering with a list of urls and parent", ()=>{
    render(<URLPage listingData={mockData}/>);
    const allListItems = screen.getAllByRole("listitem");
    expect(allListItems.length).toBe(5);
    expect(screen.getByText(/\.\./ui)).toBeInTheDocument();
    expect(screen.getByText(/ant-junit\//ui)).toBeInTheDocument();
    expect(screen.getByText(/ant-launcher\//ui)).toBeInTheDocument();
    expect(screen.getByText(/ant-nodeps\//ui)).toBeInTheDocument();
    expect(screen.getByText(/http:\/\/localhost\/api\/browse\/maven\/remote\/central/ui)).toBeInTheDocument();
  });
});
