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
import {Link, useParams} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {StoreViewControlPanel as ControlPanel} from './StoreControlPanels.jsx';
import {DisableTimeoutHint} from './Hints.jsx';
import {Utils} from '../CompUtils.js';
import {Filters} from '../Filters.js';
import {TimeUtils} from '../../TimeUtils.js';
import {jsonGet} from '../../RestClient.js';

export default function GroupView() {
  const [state, setState] = useState({
    store: {},
    raw: {},
    message: ''
  });
  return <div>This is not implemented yet!</div>;
}
