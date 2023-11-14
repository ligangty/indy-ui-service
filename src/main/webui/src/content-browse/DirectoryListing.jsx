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
import {styles} from './style.js';
import {jsonRest} from '../app/RestClient.js';

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
  const elems = [];
  if(props.parentUrl){
    const parentUrl = props.parentUrl.replace("/api/browse", "/browse");
    elems.push(<li key="parent"><a href={parentUrl}>..</a></li>);
  }
  if(props.urls){
    props.urls.forEach((urlResult, index)=>{
      const source = `sources:\n${urlResult.sources.join("\n")}`;
      const url = replaceUrl(urlResult.listingUrl);
      const paths = urlResult.path.split('/');
      const path = urlResult.path.endsWith("/")? paths[paths.length-2] + "/" : paths[paths.length-1];
      elems.push(<li key={"urlList"+index}><a className="item-link" title={source} href={url} path={urlResult.path}>{path}</a></li>);
    });
  }
  return (
    <ul style={styles.ItemListing}>
      {elems}
    </ul>
  );
};

URLList.propTypes = {
  urls: PropTypes.array.isRequired,
  parentUrl: PropTypes.string
};

const Footer = props => {
  const elems = props.sources && props.sources.map((src, index)=>{
      const url = src.replace(/http(s{0,1}):\/\/.*?\//u, getFullHost()+"/");
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

Footer.propTypes = {
  sources: PropTypes.array.isRequired
};

const getStoreKey = storeKey => {
  const storeElems = storeKey.split(":");
  return {
    "packageType": storeElems[0],
    "type": storeElems[1],
    "name": storeElems[2]
  };
};

export const URLPage = props => {
  const data = props.listingData;
  return <div>
    <h2 style={styles.Header} key="title">Directory listing for {data.path} on {getStoreKey(data.storeKey).name}</h2>
    <URLList key="urllist" parentUrl={data.parentUrl} urls={data.listingUrls} />
    <Footer key="footer" sources={data.sources} />
  </div>;
};

URLPage.propTypes = {
  listingData: PropTypes.object.isRequired
};

const init = setState => {
  const url =`/api${document.location.pathname}`;
  useEffect(()=>{
    const fetchData = async () => {
      const response = await jsonRest.get(url);
      if(response.ok){
        const data = await response.json();
        setState({
          isLoaded: true,
          data
        });
      }else{
        response.text().then(error=>setState({
          isLoaded: true,
          error
        }));
      }
    };
    fetchData();
  }, []);
};

export default function DirectoryListing () {
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
  document.title = `Directory listing for ${data.path} on ${getStoreKey(data.storeKey).name}`;
  return <URLPage listingData={data} />;
}
