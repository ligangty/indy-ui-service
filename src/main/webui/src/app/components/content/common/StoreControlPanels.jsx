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

import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import {Modal} from 'bootstrap';
import {PropTypes} from 'prop-types';
import {Utils} from '#utils/AppUtils';
import {IndyRest} from '#utils/RestClient';
import {ChangeLogDialog, ConfirmDialog} from './PopupDialogs.jsx';

const {storeRes} = IndyRest;

const save = (store, mode, postSuccessHandler) => {
  const saveStore = async () => {
    let res = {};
    if(mode==="new"){
      res = await storeRes.create(store);
    }else if(mode ==="edit"){
      res = await storeRes.update(store);
    }
    if (!res.success){
      // TODO: find another way to do error handling
      Utils.logMessage(res.error.message);
    }
    if(res.success){
      postSuccessHandler(store);
    }
  };
  saveStore();
};

const remove = (store, postHandler) => {
  const removeStore = async ()=>{
    const res = await storeRes.delete(store.packageType, store.type, store.name);
    if(!res.success){
      // TODO: Some other way to handle errors?
      Utils.logMessage(res.error.message);
    }
    if(res.success){
      // TODO: Some other way to show deletion success?
      Utils.logMessage("Store deleted.");
    }
    postHandler(store);
  };
  removeStore();
};

const StoreViewControlPanel = function({store}){
  const navigate = useNavigate();
  const handleEnable = () =>{
    store.disabled = false;
    if(store.metadata){
      store.metadata.changelog = "Enabling via UI";
    }else{
      store.metadata = {changelog: "Enabling via UI"};
    }
    save(store, "edit", st => navigate(`/${st.type}/${st.packageType}/view/${st.name}`));
  };
  const handleDisable = () =>{
    store.disabled = true;
    if(store.metadata){
      store.metadata.changelog = "Disabling indefinitely via UI";
    }else{
      store.metadata = {changelog: "Disabling indefinitely via UI"};
    }
    save(store, "edit", st => navigate(`/${st.type}/${st.packageType}/view/${st.name}`));
  };
  const [enableText, enableHandler] = store.disabled?["Enable",handleEnable]:["Disable",handleDisable];

  const [showConfirmBox, setShowConfirm] = useState(false);
  const showConfirmLog = () =>{
    setShowConfirm(true);
  };
  const cancelConfirmLog = ()=>{
    setShowConfirm(false);
  };
  const handleRemove = () => remove(store, st => navigate(`/${st.type}/${st.packageType}`));
  const [pkgType, storeType, storeName] = [store.packageType, store.type, store.name];

  return(
    <div className="cp-row-group">
      <div className="cp-row">
        <button onClick={enableHandler}>{enableText}</button>
      </div>
      <div className="cp-row">
        <button onClick={()=>navigate(`/${storeType}/${pkgType}/edit/${storeName}`)}>Edit</button>{'  '}
        <button onClick={()=>navigate(`/${storeType}/new`)}>New...</button>{'  '}
        <button name="delete" onClick={showConfirmLog} className="del-button cp-button">
          Delete
        </button>
        <ConfirmDialog showBox={showConfirmBox}
         title="Are you sure to delete this repository?"
         handleCancel={cancelConfirmLog} handleConfirm={handleRemove} />
      </div>
    </div>
  );
};

StoreViewControlPanel.propTypes={
  store: PropTypes.object
};

const StoreEditControlPanel = ({mode, store, handleSubmit, validate, changelog}) =>{
  const navigate = useNavigate();

  const handleCancel = () => {
    if(mode === 'edit'){
      navigate(`${Utils.detailHref(store.key)}`);
    }
    if(mode==='new'){
      navigate(`/${store.type}/${store.packageType}`);
    }
  };

  const handleRemove = () => {
    // Only edit page should handle delete logic
    if(mode==="edit"){
      remove(store, st => navigate(`/${st.type}/${st.packageType}`));
    }
  };

  const postSuccessHandler = st => navigate(`/${st.type}/${st.packageType}/view/${st.name}`);
  let handleSave = () => save(store, mode, postSuccessHandler);
  if(handleSubmit && typeof handleSubmit === 'function'){
    handleSave = handleSubmit(data=>{
      data.disabled = !data.enabled;
      data.enabled = undefined;
      // store.constituents can be updated without data being updated
      data.constituents = store.constituents;
      if(data.changelog && data.changelog.trim() !== ''){
        if (data.metadata && data.metadata.changelog) {
          // need to overwrite previous changelog here
          data.metadata.changelog = data.changelog;
        }
        if(store.metadata){
          store.metadata.changelog = data.changelog;
        }else{
          store.metadata = {changelog: data.changelog};
        }
        data.changelog = undefined;
      }
      Utils.rewriteTargetObject(data, store);
      save(store, mode, postSuccessHandler);
    });
  }

  const [showChangeBox, setShowChange] = useState(false);
  const showCommitMsg = () =>{
    validate().then(valid => valid && setShowChange(true));
  };
  const cancelCommitMsg = ()=>{
    setShowChange(false);
  };

  const [showConfirmBox, setShowConfirm] = useState(false);
  const showConfirmLog = () =>{
    validate().then(valid => valid && setShowConfirm(true));
  };
  const cancelConfirmLog = ()=>{
    setShowConfirm(false);
  };

  return <div className="cp-row">
    <button name="save" onClick={showCommitMsg} className="cp-button">Save</button>{'  '}
    <button name="cancel" onClick={handleCancel} className="cp-button">Cancel</button>{'  '}
    {
      mode==="edit" && <React.Fragment>
        <button name="delete" onClick={showConfirmLog} className="del-button cp-button">
          Delete
        </button>
        <ConfirmDialog showBox={showConfirmBox}
         title="Are you sure to delete this repository?"
         handleCancel={cancelConfirmLog} handleConfirm={handleRemove} />
      </React.Fragment>
    }
    <ChangeLogDialog showBox={showChangeBox} handleCancel={cancelCommitMsg} handleSave={handleSave} changelog={changelog} />
  </div>;
};

StoreEditControlPanel.propTypes={
  mode: PropTypes.string,
  store: PropTypes.object,
  handleSubmit: PropTypes.func,
  validate: PropTypes.func,
  changelog: PropTypes.object
};

export {StoreViewControlPanel, StoreEditControlPanel};
