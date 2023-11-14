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

import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';

const ListJsonDebugger = ({enableDebug, jsonObj}) => {
  if (enableDebug && jsonObj){
    return <div className="debug">
      JSON:
      <JSONPretty id="json-pretty" json={jsonObj}></JSONPretty>
    </div>;
  }
  return <Fragment></Fragment>;
};

ListJsonDebugger.propTypes = {
  enableDebug: PropTypes.bool,
  jsonObj: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

const ViewJsonDebugger = ({enableDebug, storeJson, rawJson}) => enableDebug &&
  <div className="debug">
  {
    storeJson &&
    <div className="debug-section">
      <span className="debug-title">JSON FROM SERVER:</span>
      <JSONPretty id="store-json-pretty" json={storeJson}></JSONPretty>
    </div>
  }
  {
    rawJson &&
    <div className="debug-section">
      <span className="debug-title">JSON FOR DISPLAY:</span>
      <JSONPretty id="raw-json-pretty" json={rawJson}></JSONPretty>
    </div>
  }
  </div>;

ViewJsonDebugger.propTypes = {
  enableDebug: PropTypes.bool,
  storeJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  rawJson: PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export {ListJsonDebugger, ViewJsonDebugger};
