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
import {useForm} from 'react-hook-form';

import {IndyRest} from '#utils/RestClient.js';

const {contentRes} = IndyRest;

export default function Cache() {
  const [state, setState] = useState({
    path: "",
    displayData: ""
  });
  const deleteCache = async contentPath => {
    const res = await contentRes.delete(contentPath);
    if (res.success){
      setState({displayData: ` ${contentPath} is deleted successfully!`});
    }else{
      setState({displayData: `Deleting failed! Reason: ${res.error.message}`});
    }
  };
  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm();
  const submit = e => {
    e.preventDefault();
    handleSubmit(data=>{
      deleteCache(data.path);
    })();
  };
  return <form onSubmit={e => e.preventDefault()}>
    <div className="control-panel">
      <div className="cp-row">
        Delete broken metadata file from groups or remote repositories.
      </div>
      <div className="cp-row">
        <label htmlFor="conent-path">Input the the metadata url:</label>
        (Can be a full or a relative url like &quot;/api/content/maven/group/central/org/foo/bar/maven-metadata.xml. Be noticed that this will trigger the deletions of the target path from all <b>affected groups</b>.&quot;)
        <input id="conent-path" style={{width: "100%"}} {...register("path", {required: true})}/>
        {errors.path?.type === "required" && <span className="alert">Metadata url is required</span>}
      </div>
      <div className="cp-row">
        <button onClick={submit}>Delete</button>
      </div>
    </div>
    <div className="content-panel">
      <div>{state.displayData}</div>
    </div>
  </form>;
}
