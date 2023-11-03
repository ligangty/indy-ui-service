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
import {HashRouter, Route, Routes} from 'react-router-dom';
import NavHeader from './nav/NavHeader.jsx';
import NavFooter from './nav/NavFooter.jsx';
import {Main} from './content/Main.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/indy.css';

const Root = () => <React.Fragment>
    <NavHeader />
    <Main />
    <NavFooter />
  </React.Fragment>;

export const App = ()=> <HashRouter basename="">
    <Routes>
      <Route path="*" element={<Root />} />
    </Routes>
  </HashRouter>;
