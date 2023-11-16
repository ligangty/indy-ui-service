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
import {PropTypes} from 'prop-types';

export default function ListControl({handleCreateNew, useHideAll, handleHideAll,
  useSearch, handleSearch, useOrderBy, orderBys, useLegend, legends,
  useDebug, handleDebug}) {
  const [debug, setDebug] = useState(false);
  return (
    <div className="control-panel">
      <div className="cp-row">
        <button onClick={handleCreateNew}>New...</button>{' '}
        {
          useHideAll &&
            <button onClick={handleHideAll}>Hide All</button>
        }
      </div>
      {
        useSearch &&
          <div className="cp-row">
            Search:{' '}<input name="query" onChange={handleSearch}/>
          </div>
      }
      {
        useOrderBy && orderBys &&
          <div className="cp-row">
            Sort by:{' '}
            <select name="orderProp">
              {
                orderBys.map(orderBy=><option key={`legend-${orderBy.value}`} value={orderBy.value}>{orderBy.text}</option>)
              }
            </select>
          </div>
      }
      {
        useLegend && legends &&
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
        useDebug &&
          <div className="cp-row cp-debug">
            <input type="checkbox" name="enableDebug" checked={debug} onChange={handleDebug} /> Debug Data
          </div>
      }
    </div>
  );
}

ListControl.propTypes={
  handleCreateNew: PropTypes.func,
  useHideAll: PropTypes.bool,
  handleHideAll: PropTypes.func,
  useSearch: PropTypes.bool,
  handleSearch: PropTypes.func,
  useOrderBy: PropTypes.bool,
  orderBys: PropTypes.array,
  useLegend: PropTypes.bool,
  legends: PropTypes.array,
  useDebug: PropTypes.bool,
  handleDebug: PropTypes.func
};
