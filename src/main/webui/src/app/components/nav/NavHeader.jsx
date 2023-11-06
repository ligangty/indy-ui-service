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

import React, {useState} from 'react';
import {Link} from 'react-router-dom';

// TODO: This is mock user login, need to implement later for real login
const isUserloggedIn = true;
const username = "mock";

// eslint-disable-next-line max-lines-per-function
export default function IndyNavHeader(){
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);
  // TODO: addons will be render based on the backend addons response, this is a mock;
  let addons=[
    <Link key="autoproxy-calc" className="dropdown-item" to="/autoprox/calc">AutoProx Calculator</Link>,
    <Link key="autoproxy-rules" className="dropdown-item" to="/autoprox/rules">AutoProx Rules</Link>,
    <Link key="store-changelog" className="dropdown-item" to="/revisions/changelog/stores">Store Changelogs</Link>
  ];
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light" role="navigation">
      <Link className="navbar-brand" to="">Indy</Link>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li key="list-remote" className="nav-item">
            <Link className="nav-link" to="/remote">Remote Repositories</Link>
          </li>
          <li key="list-hosted" className="nav-item">
            <Link className="nav-link" to="/hosted">Hosted Repositories</Link>
          </li>
          <li key="list-group" className="nav-item">
            <Link className="nav-link" to="/group">Groups</Link>
          </li>
          <li key="rest-api" className="nav-item">
            <a className="nav-link"href="rest-api.html">REST API</a>
          </li>
          <li key="list-addons" className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              more
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="/api/diag/bundle">Diagnostic Bundle</a>
              <a className="dropdown-item" href="/api/diag/repo">Repo Bundle</a>
              <Link className="dropdown-item" to="/nfc">Not-Found Cache</Link>
              <Link className="dropdown-item" to="/cache/delete">Delete Cache</Link>
              <div className="dropdown-divider"></div>
              {addons}
            </div>
          </li>
          { isUserloggedIn &&
            <li key="list-logged-in" className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {username}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/logout">Log Out</Link>
              </div>
            </li>
          }
        </ul>
      </div>
    </nav>
  );
}
