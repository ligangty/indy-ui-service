//
// Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//         http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
/* eslint-disable react/prop-types */
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {styles} from './style.js';

const replaceUrl = url =>{
  if (url.includes("api/browse")){
    return url.replace(/http(s{0,1}):\/\/.*\/api/u, "");
  }
  return url.replace(/http(s{0,1}):\/\/.*?\//u, "/");
};

const getFullHost = () => {
  let fullHost = location.protocol + "//" + location.hostname;
  if (location.port){
    fullHost = fullHost + ":" + location.port;
  }
  return fullHost;
};

const URLList = props => {
  let elems = [];
  if(props.parentUrl){
    let parentUrl = props.parentUrl.replace("/api/browse", "/browse");
    elems.push(<li key="parent"><a href={parentUrl}>..</a></li>);
  }
  if(props.urls){
    props.urls.forEach((urlResult, index)=>{
      let source = `sources:\n${urlResult.sources.join("\n")}`;
      let url = replaceUrl(urlResult.listingUrl);
      let paths = urlResult.path.split('/');
      let path = urlResult.path.endsWith("/")? paths[paths.length-2] + "/" : paths[paths.length-1];
      elems.push(<li key={"urlList"+index}><a className="item-link" title={source} href={url} path={urlResult.path}>{path}</a></li>);
    });
  }
  return (
    <ul style={styles.ItemListing}>
      {elems}
    </ul>
  );
};

const Footer = props => {
  const elems = props.sources && props.sources.map((src, index)=>{
      let url = src.replace(/http(s{0,1}):\/\/.*?\//u, getFullHost()+"/");
      return <li key={"footer"+index}><a className="source-link" title={url} href={url}>{url}</a></li>;
    });
  return(
    <footer style={styles.Footer}>
      <p>Sources for this page:</p>
      <ul>
        {elems}
      </ul>
    </footer>
  );
};

const init = setState => {
  const url =`/api${document.location.pathname}`;
  useEffect(()=>{
    const fetchData = async () => {
      const response = await axios.get(url).catch(error=>{
        if (error.response) {
          setState({
            isLoaded: true,
            error: JSON.parse(error.response.data).error
          });
        }else{
          setState({
            isLoaded: true,
            error
          });
        }
      });
      if(response.status === 200){
        setState({
          isLoaded: true,
          data: response.data
        });
      }
    };
    fetchData();
  }, []);
};

const getStoreKey = state => {
  let storeElems = state.data.storeKey.split(":");
  return {
    "packageType": storeElems[0],
    "type": storeElems[1],
    "name": storeElems[2]
  };
};

export const URLPage = ()=>{
  const [state, setState] = useState({
      error: null,
      isLoaded: false,
      data: {}
  });

  init(setState);

  const {error, isLoaded, data} = state;
  if (error) {
    return <div>Error: {error}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  }
  document.title = `Directory listing for ${data.path} on ${getStoreKey(state).name}`;
  return (
    <div>
      <h2 style={styles.Header} key="title">Directory listing for {data.path} on {getStoreKey(state).name}</h2>
      <URLList key="urllist" parentUrl={data.parentUrl} urls={data.listingUrls} />
      <Footer key="footer" sources={data.sources} />
    </div>
  );
};
