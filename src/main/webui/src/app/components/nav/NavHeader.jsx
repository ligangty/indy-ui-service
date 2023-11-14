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
import Dropdown from 'react-bootstrap/Dropdown';
import Button from 'react-bootstrap/Button';
import {LinkContainer} from 'react-router-bootstrap';

// TODO: This is mock user login, need to implement later for real login
const isUserloggedIn = true;
const username = "mock";

// eslint-disable-next-line max-lines-per-function
export default function IndyNavHeader(){
  const [isOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!isOpen);
  // TODO: addons will be render based on the backend addons response, this is a mock;
  const addons=[
    <Link key="autoproxy-calc" className="dropdown-item" to="/autoprox/calc">AutoProx Calculator</Link>,
    <Link key="autoproxy-rules" className="dropdown-item" to="/autoprox/rules">AutoProx Rules</Link>,
    <Link key="store-changelog" className="dropdown-item" to="/revisions/changelog/stores">Store Changelogs</Link>
  ];
  return (
    <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-light" role="navigation">
      <Link className="navbar-brand" to="">Indy</Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {
            [
              {type: "remote", desc: "Remote Repositories"},
              {type: "hosted", desc: "Hosted Repositories"},
              {type: "group", desc: "Groups"}
            ].map(o =><Dropdown key={`dropdown-${o.type}`} data-bs-theme="dark" className="mx-1">
                <Dropdown.Toggle id={`dropdown-button-dark-${o.type}`} variant="secondary">
                  {o.desc}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    ["maven", "generic-http", "npm"].map(pkgType => <LinkContainer key={`link-${pkgType}`} to={`/${o.type}/${pkgType}`}>
                        <Dropdown.Item>{pkgType}</Dropdown.Item>
                      </LinkContainer>)
                  }
                </Dropdown.Menu>
              </Dropdown>)
          }
          <Button href="/q/swagger-ui/" variant="secondary" className="mx-1">REST API</Button>
          <Dropdown data-bs-theme="dark" className="mx-1">
            <Dropdown.Toggle id={`dropdown-button-dark-addons`} variant="secondary">
              more
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <LinkContainer to="/nfc">
                <Dropdown.Item>Not-Found Cache</Dropdown.Item>
              </LinkContainer>
              <LinkContainer to="/cache/delete">
                <Dropdown.Item>Delete Cache</Dropdown.Item>
              </LinkContainer>
            </Dropdown.Menu>
          </Dropdown>
          { isUserloggedIn && <Dropdown data-bs-theme="dark" className="mx-1">
              <Dropdown.Toggle id={`dropdown-button-dark-addons`} variant="link">
                {username}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="/logout" variant="link">Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          }
        </ul>
      </div>
    </nav>
  );
}
