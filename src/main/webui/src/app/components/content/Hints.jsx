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

const Hint = ({hintKey}) => {
  let hint = 'unknown hint: ' + hintKey;
  switch(hintKey){
    case 'passthrough':
      hint = 'subject to a configured minimum cache timeout for performance reasons';
      break;
    case 'request_timeout':
      hint = 'subject to a configured minimum request timeout for performance reasons';
      break;
    case 'client_key':
      hint = 'required if Client Key is supplied';
      break;
    default:
      break;
  }

  return <span className="hint">({hint})</span>;
};

Hint.propTypes = {
  hintKey: PropTypes.string.isRequired
};

const PasswordMask = ()=> <span className="password-mask">********</span>;

// TODO: this DisableTimeoutHint and PrefetchHint has a timeout in original angular like below:
// ['$timeout',function(timer) {
// .....
// timer(..., 0)
// }]
// Not sure what this timeout is doing, will check it later
const DisableTimeoutHint = ({children}) =>{
  let suggestion = children ? children:
    'Integer time in seconds which is used for repo automatically re-enable when set disable by errors,' +
    'positive value means time in seconds, -1 means never disable, empty or 0 means use default timeout.';

  return <span className="hint">({suggestion})</span>;
};

DisableTimeoutHint.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

const PrefetchHint = ({children}) => {
  const suggestion = children ? children:
    'Integer to indicate the pre-fetching priority of the remote, higher means more eager to do the ' +
    'pre-fetching of the content in the repo, 0 or below means disable the pre-fecthing.';

  return <span className="hint">({suggestion})</span>;
};

PrefetchHint.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

const DurationHint = ({children}) => {
  const suggestion = children ? children : "24h 36m 00s";
  return <span className="hint">({`eg. ${suggestion}`})</span>;
};

DurationHint.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};

export {Hint, PasswordMask, DisableTimeoutHint, PrefetchHint, DurationHint};
