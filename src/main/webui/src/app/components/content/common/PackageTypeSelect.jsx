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

import React, {useState, useEffect} from 'react';
import {PropTypes} from 'prop-types';
import {IndyRest} from '#utils/RestClient.js';
import {Utils} from '#utils/AppUtils';

const {statsRes} = IndyRest;

export const PackageTypeSelect = ({register, formErrors}) =>{
  const [state, setState] = useState({
    pkgTypes: []
  });
  const [selected, setSelected] = useState();

  useEffect(()=>{
    (async () =>{
      const res = await statsRes.getAllPkgTypes();
      if (res.success){
        const pkgTypes = res.result;
        setState({pkgTypes});
      }else{
        Utils.logMessage(res);
      }
    })();
  }, []);

  let registered = {};
  if(register){
    registered = register("packageType", {required: true});
  }
  return <span>
    <select role="pkgTypeSel" value={selected}
      onChange={e => setSelected(e.target.value)} {...registered}>
      <option value=""></option>
      {
        state.pkgTypes.map(type => <option key={`pkgType:${type}`} value={type}>{type}</option>)
      }
    </select>{' '}
    {formErrors && formErrors.packageType?.type === "required" && <span className="indy-alert">Package Type is required</span>}
  </span>;
};

PackageTypeSelect.propTypes = {
  register: PropTypes.func,
  formErrors: PropTypes.object
};
