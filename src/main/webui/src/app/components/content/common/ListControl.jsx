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

/* eslint-disable max-lines-per-function */
import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {PropTypes} from 'prop-types';

export default function ListControl({type, legends, handleHideAll, handleSearch, handleDebug}) {
  const [debug, setDebug] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="control-panel">
      <div className="cp-row">
        <button onClick={() => navigate(`/${type}/new`)}>New...</button>{' '}
        {
          type==="group" &&
            <button onClick={handleHideAll}>Hide All</button>
        }
      </div>
      <div className="cp-row">
        Search:{' '}<input name="query" onChange={handleSearch}/>
      </div>
      {
        type==="remote" &&
          <div className="cp-row">
            Sort by:{' '}
            <select name="orderProp">
              {
                [
                  {value: 'key', text: 'Name'},
                  {value: 'url', text: 'Remote URL'}
                ].map(orderBy=><option key={`legend-${orderBy.value}`} value={orderBy.value}>{orderBy.text}</option>)
              }
            </select>
          </div>
      }
      {
         legends && legends.length > 0 &&
          <div className="cp-row">
            <div className="legend">
              <div className="label" style={{fontSize: "75%",
                padding: ".2em .6em .3em"}}>Capability Legend:</div>
              <ul>
                {
                  legends.map(option => <li key={option.title}>
                    <div>
                      <span className="key">{option.icon} </span>
                      <span>{option.title}</span>
                    </div>
                  </li>)
                }
              </ul>
            </div>
          </div>

      }
      {
        handleDebug &&
          <div className="cp-row cp-debug">
            <input type="checkbox" name="enableDebug" checked={debug} onChange={handleDebug} /> Debug Data
          </div>
      }
    </div>
  );
}

ListControl.propTypes={
  type: PropTypes.string,
  legends: PropTypes.array,
  handleHideAll: PropTypes.func,
  handleSearch: PropTypes.func.reqired,
  handleDebug: PropTypes.func
};
