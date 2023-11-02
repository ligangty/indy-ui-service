//
// Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//         http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//

import React from 'react';

export default function NavFooter() {
  // TODO: stats will be render based on the backend addons response, this is a mock;
  let stats = {
    version: "1.6.0",
    commitId: "f472176",
    builder: "ligangty",
    timestamp: "2018-10-24 05:54 +0000"
  };
  const gridClass = "col-md-auto border-right border-secondary";
  return (
    <nav className="navbar fixed-bottom navbar-expand-lg navbar-light bg-light" role="navigation">
      <div className="container">
        <div className="row">
          <div className={gridClass}>
            <a target="_new" href="http://commonjava.github.io/indy/">Docs</a>
          </div>
          <div className={gridClass}>
            <a target="_new" href="http://github.com/commonjava/indy/issues">Issues</a>
          </div>
          <div className={gridClass}>
            Version:{stats.version}
          </div>
          <div className={gridClass}>
            Commit ID: <a target="_new" href={`http://github.com/commonjava/indy/commit/${stats.commitId}`}>{stats.commitId}</a>
          </div>
          <div className="col-md-auto">
            Built on {stats.timestamp} by <a target="_new" href={`http://github.com/${stats.builder}`}>{stats.builder}</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
