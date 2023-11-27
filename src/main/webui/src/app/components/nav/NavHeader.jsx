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

import React from 'react';
import {Link} from 'react-router-dom';

// TODO: This is mock user login, need to implement later for real login
const isUserloggedIn = true;
const username = "mock";

// eslint-disable-next-line max-lines-per-function
export default function NavHeader(){
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light" role="navigation">
      <div className="container-fluid collapse navbar-collapse">
      <Link className="navbar-brand" to="">Indy</Link>
        <ul className="navbar-nav me-auto">
          {
            [
              {type: "remote", desc: "Remote Repositories"},
              {type: "hosted", desc: "Hosted Repositories"},
              {type: "group", desc: "Groups"}
            ].map(o =><React.Fragment key={`frag-${o.type}`}>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target={`navbarSupport-${o.type}`} aria-controls={`navbarSupport-${o.type}`} aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div id={`navbarSupport-${o.type}`}>
                <li key={`li-${o.type}`} className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {o.desc}
                  </a>
                  <ul className="dropdown-menu">
                    {
                      ["maven", "generic-http", "npm"].map(pkgType =><li key={`li-${o.type}-${pkgType}`}>
                        <Link className="dropdown-item" key={`link-${pkgType}`} to={`/${o.type}/${pkgType}`}>{pkgType}</Link>
                      </li>)
                    }
                  </ul>
                </li>
              </div>
            </React.Fragment>)
          }
          <li className="nav-item">
            <a className="nav-link" href="/q/swagger-ui/">REST API</a>
          </li>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="navbarSupport-addons" aria-controls="navbarSupport-addons" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div id="navbarSupport-addons">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              More
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link className="dropdown-item" to="/nfc">Not-Found Cache</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/cache/delete">Delete Cache</Link>
                </li>
              </ul>
            </li>
          </div>
          </ul>
          { isUserloggedIn && <ul className="navbar-nav ms-auto">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="navbarSupport-login" aria-controls="navbarSupport-login" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div id="navbarSupport-login">
                <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    {username}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="/logout">Log Out</a>
                    </li>
                  </ul>
                </li>
              </div>
            </ul>
          }
      </div>
    </nav>
  );
}
