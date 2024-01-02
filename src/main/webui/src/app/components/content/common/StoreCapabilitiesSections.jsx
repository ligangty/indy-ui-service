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
import {PropTypes} from 'prop-types';
import {Filters} from '#utils/Filters.js';
import {TimeUtils} from '#utils/TimeUtils.js';

export const StoreViewCapabilitiesSection = ({store}) => (store.type==="remote"|| store.type==="hosted") &&
<React.Fragment>
  <div className="fieldset-caption">Capabilities</div>
  <div className="fieldset">
    {
      store.type==="hosted" && <div className="detail-field">
        <span>{Filters.checkmark(store.allow_releases || store.allow_snapshots)}</span>
        <label>Allow Uploads</label>
      </div>
    }
    <div className="detail-field">
      <span>{Filters.checkmark(store.allow_releases)}</span>
      <label>Allow Releases</label>
    </div>
    <div className="detail-field">
      <span>{Filters.checkmark(store.allow_snapshots)}</span>
      <label>Snapshots Allowed?</label>
    </div>
    {
      store.type==="hosted" && store.allow_snapshots && <div className="sub-fields">
      <div className="detail-field">
        <label>Snapshot Timeout:</label>
        <span>{TimeUtils.secondsToDuration(store.snapshotTimeoutSeconds)}</span>
      </div>
    </div>
    }
  </div>
</React.Fragment>;

StoreViewCapabilitiesSection.propTypes = {
  store: PropTypes.object.isRequired
};
