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
import {Route, Routes} from 'react-router-dom';
import RemoteList from './RemoteList.jsx';
import HostedList from './HostedList.jsx';
import GroupList from './GroupList.jsx';
import RemoteView from './RemoteView.jsx';
import HostedView from './HostedView.jsx';
import GroupView from './GroupView.jsx';
import RemoteEdit from './RemoteEdit.jsx';

// const browseCompatible=`<!--[if lt IE 7]>
//     <p className="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
// <![endif]-->`;

// const isHome = false;

const Home = () => <React.Fragment>Welcome! Make a selection from the menu above to proceed.</React.Fragment>;

export const Main = () => <div>
    {
     // browseCompatible
    }
    <React.Fragment>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route exact path="/remote" element={<RemoteList />} />
        <Route exact path="/hosted" element={<HostedList />} />
        <Route exact path="/group" element={<GroupList />} />

        <Route path="/remote/:packageType/view/:name" element={<RemoteView />} />
        <Route path="/hosted/:packageType/view/:name" element={<HostedView />} />
        <Route path="/group/:packageType/view/:name" element={<GroupView />} />

        <Route exact path="/remote/new" element={<RemoteEdit />} />
        <Route path="/remote/:packageType/edit/:name" element={<RemoteEdit />} />
        {
        // <Route exact path={["/hosted/new","/hosted/:packageType/edit/:name"]} element={HostedEdit} />
        // <Route exact path={["/group/new","/group/:packageType/edit/:name"]} element={GroupEdit} />

        // <Route exact path={["/nfc", "/nfc/view/all", "/nfc/view/:packageType/:type/:name"]} element={} />
        //
        // <Route exact path={"/logout"} element={} />
        }
      </Routes>
    </React.Fragment>
  </div>;
