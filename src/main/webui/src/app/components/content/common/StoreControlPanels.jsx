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
import {useNavigate} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {Utils} from '../../CompUtils';
import {http} from '../../../RestClient';

const StoreEditControlPanel = ({handleSave, handleCancel, handleRemove}) => <div className="cp-row">
    <button name="save" onClick={handleSave} className="cp-button">Save</button>{'  '}
    <button name="cancel" onClick={handleCancel} className="cp-button">Cancel</button>{'  '}
    <button name="del" onClick={handleRemove} className="del-button cp-button">
      Delete
    </button>
  </div>;
StoreEditControlPanel.propTypes={
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
  handleRemove: PropTypes.func
};

const StoreViewControlPanel = function({enabled, storeObj, handleDisable, handleEnable}){
  const [enableText, enableHandler] = enabled?["Disable",handleDisable]:["Enable",handleEnable];
  const navigate = useNavigate();

  const [pkgType, storeType, storeName] = [storeObj.packageType, storeObj.type, storeObj.name];
  const storeUrl = `/api/admin/stores/${pkgType}/${storeType}/${storeName}`;
  const handleRemove = async ()=>{
    const response = await http.delete(storeUrl);
    if(!response.ok && response.status >= 400){
      // TODO: Some other way to handle errors?
      response.text().then(error=>Utils.logMessage(error));
    }
    if(response.status===204){
      // TODO: Some other way to show deletion success?
      Utils.logMessage("Store deleted.");
    }
    navigate(`/${storeObj.type}`);
  };

  return(
    <div className="cp-row-group">
      <div className="cp-row">
        <button onClick={enableHandler}>{enableText}</button>
      </div>
      <div className="cp-row">
        <button onClick={()=>navigate(`/${storeType}/${pkgType}/edit/${storeName}`)}>Edit</button>{'  '}
        <button onClick={()=>navigate(`/${storeType}/new`)}>New...</button>{'  '}
        <button name="del" onClick={handleRemove} className="del-button cp-button">
          Delete
        </button>
      </div>
    </div>
  );
};

StoreViewControlPanel.propTypes={
  enabled: PropTypes.bool,
  storeObj: PropTypes.object,
  handleDisable: PropTypes.func,
  handleEnable: PropTypes.func
};

export {StoreEditControlPanel, StoreViewControlPanel};
