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
import {Utils} from '../../../utils/AppUtils';
import {jsonRest,http} from '../../../utils/RestClient';

const StoreEditControlPanel = ({mode, store}) =>{
  const navigate = useNavigate();
  const handleSave = () => {
    const saveUrl = `/api/admin/stores/${store.packageType}/${store.type}/${store.name}`;
    const saveStore = async () => {
      let response = {};
      if(mode==="new"){
        response = await jsonRest.post(saveUrl, store);
      }else if(mode ==="edit"){
        response = await jsonRest.put(saveUrl, store);
      }
      if (!response.ok){
        // TODO: find another way to do error handling
        response.text().then(error=>Utils.logMessage(error));
      }
      if(response.status >= 200 || response.status < 300){
        navigate(`/${store.type}/${store.packageType}/view/${store.name}`);
      }
    };
    saveStore();
  };

  const handleCancel = () => {
    if(mode === 'edit'){
      navigate(`/${store.type}/${store.packageType}/view/${store.name}`);
    }
    if(mode==='new'){
      navigate(`/${store.type}/${store.packageType}`);
    }
  };

  const handleRemove = () => {
    // Only edit page should handle delete logic
    if(mode==="edit"){
      const deleteUrl = `/api/admin/stores/${store.packageType}/${store.type}/${store.name}`;
      const deleteStore = async () => {
        const response = await http.delete(deleteUrl);
        if (!response.ok){
          // TODO: find another way to do error handling
          response.text().then(error=>Utils.logMessage(error));
        }
        if(response.status >= 200 || response.status < 300){
          navigate(`/${store.type}/${store.packageType}`);
        }
      };
      deleteStore();
    }
  };

  return <div className="cp-row">
    <button name="save" onClick={handleSave} className="cp-button">Save</button>{'  '}
    <button name="cancel" onClick={handleCancel} className="cp-button">Cancel</button>{'  '}
    {
      mode==="edit" && <button name="del" onClick={handleRemove} className="del-button cp-button">
        Delete
      </button>
    }
  </div>;
};
StoreEditControlPanel.propTypes={
  mode: PropTypes.string,
  store: PropTypes.object
};

const StoreViewControlPanel = function({store}){
  const handleEnable = () =>{
    // TODO: need to implement
  };
  const handleDisable = () =>{
    // TODO: need to implement
  };
  const [enableText, enableHandler] = store.disabled?["Enable",handleEnable]:["Disable",handleDisable];
  const navigate = useNavigate();

  const [pkgType, storeType, storeName] = [store.packageType, store.type, store.name];
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
    navigate(`/${store.type}`);
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
  store: PropTypes.object
};

export {StoreEditControlPanel, StoreViewControlPanel};
