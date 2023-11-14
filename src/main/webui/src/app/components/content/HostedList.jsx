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

import React, {useEffect, useState} from 'react';
import ListControl from "./ListControl.jsx";
import {ListJsonDebugger} from './Debugger.jsx';
import {Utils} from '../CompUtils.js';
import {hostedOptionLegend as options} from "../ComponentConstants.js";
import {StoreListingWidget} from './CommonPageWidget.jsx';



export default function HostedList() {
  const [state, setState] = useState({
    listing: [],
    rawListing: [],
    disabledMap: {},
    enableDebug: false,
    message: ''
  });

  return <div>This is not implemented yet</div>;
}
