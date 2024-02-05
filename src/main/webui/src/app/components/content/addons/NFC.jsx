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

import React, {useState, useEffect, useRef, Fragment} from 'react';
import {LoadingSpiner} from '../common/LoadingSpiner.jsx';
import {IndyRest} from '#utils/RestClient.js';
import {Utils} from '#utils/AppUtils.js';

const {storeQueryRes, nfcRes} = IndyRest;

export default function NFC() {
  const [nfcStoreKeys, setNfcStoreKeys] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [currentKey, setCurrentKey] = useState("");
  const [sections, setSections] = useState([]);
  const rawSections = useRef([]);
  const pageSizes = [10, 50, 100];
  const page = useRef({
      index: 0,
      size: pageSizes[0]
  });
  const [prevDisabled, setPrevDisabled] = useState(true);
  const [paginationHidden, setPagginationHidden] = useState(true);
  const [isShowAll, setShowAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingSection, setLoadingSection] = useState(false);

  const updatePage = partialPage => {
    const newPage = Utils.cloneObj(page.current);
    for (let key in partialPage) {
      if (Object.hasOwn(partialPage, key)){
        newPage[key] = partialPage[key];
      }
    }
    page.current = newPage;
  };
  useEffect(()=>{
    setLoadingSection(true);
    (async () =>{
      const res = await storeQueryRes.getEndpoints("all");
      if (res.success){
        const raw = await res.result;
        const allKeys = raw.items.filter(item=>item.type!=="group").map(item=>item.key);
        setNfcStoreKeys(allKeys);
        setLoadingSection(false);
      }else{
        setError(res.error.message);
      }
    })();
  }, []);

  const clearMessage = () => {
    setMessage('');
    setError('');
  };

  const labelSections = secs => {
    secs.forEach(s => {
      s.label = Utils.keyLabel(s.key);
      s.paths.sort();
    });
  };

  const initSections = secs => {
    labelSections(secs);
    const raw = Utils.sortByEmbeddedKey(secs);
    setSections(raw);
    rawSections.current = raw;
  };

  const cleanSections = () => {
    rawSections.current = [];
    setSections([]);
  };

  const showSection = e => {
    const selectKey = e.target.value;
    if (!selectKey){
      return;
    }
    clearMessage();
    setCurrentKey(selectKey);
    setPagginationHidden(true);
    setLoading(true);
    const [packageType, type, name] = selectKey.split(':');
    cleanSections();
    (async ()=> {
      const resp = await nfcRes.get(packageType, type, name, "");
      if(resp.success){
        if(resp.result && resp.result.sections !== undefined){
          initSections(resp.result.sections);
          setShowAll(false);
        }
      }
      setLoading(false);
    })();
  };

  const showAll = e => {
    e.preventDefault();
    clearMessage();
    const [index, size] = [page.current.index, page.current.size];
    setPagginationHidden(false);
    setLoading(true);
    cleanSections();
    (async ()=> {
      const resp = await nfcRes.query(index, size);
      if(resp.success){
        if(resp.result && resp.result.sections !== undefined){
          initSections(resp.result.sections);
          setShowAll(true);
          setCurrentKey("");
        }
      }
      setLoading(false);
    })();
  };

  const clearAllNFC = e => {
    e.preventDefault();
    (async () => {
      const result = await nfcRes.deleteAll();
      if(result.success){
        cleanSections();
        setPagginationHidden(true);
        setMessage("All NFC entries cleared successfully.");
      }else{
        Utils.logMessage(`Failed to clear all NFC! Error reason: ${result.error.message}`);
      }
    })();
  };

  const clearSection = (section, secs) => {
    setMessage("");
    let key = section.key;
    // alert( "Clear all NFC entries for: " + key );

    let name = Utils.nameFromKey(key);
    let packageType = Utils.packageTypeFromKey(key);
    let type = Utils.typeFromKey(key);
    (async () => {
      const result = await nfcRes.delete(packageType, type, name, "");
      if(result.success){
        setMessage(`Cleared NFC for ${key}`);
        section.paths = [];
        const index = secs.indexOf(section);
        secs.splice(index, 1);
      }else{
        setMessage(`Failed to clear NFC for ${key}`);
        setError(result.error);
      }
    })();
  };

  const clearSectionPath = (section, path) => {
    const subPath = path.substring(1);
    let key = section.key;

    // alert( "Clear all NFC entries for: " + key + ", path: " + path );

    let name = Utils.nameFromKey(key);
    let packageType = Utils.packageTypeFromKey(key);
    let type = Utils.typeFromKey(key);

    (async () => {
      const result = await nfcRes.delete(packageType, type, name, subPath);
      if(result.success){
        setMessage(`Cleared NFC for ${key}, path: ${subPath}`);
        let idx = section.paths.indexOf(subPath);
        section.paths.splice(idx,1);
      }else{
        setError(result.error);
      }
    })();
  };

  const queryByPageIndexAndSize = (index, size) =>{
    setMessage("");
    setPagginationHidden(true);
    setLoading(true);
    cleanSections();
    if (isShowAll){
      // alert( "showing all NFC entries");
      // delete $scope.currentKey;
      (async () => {
        const resp = await nfcRes.query(index, size);
        if(resp.success){
          if (resp.result && resp.result.sections !== undefined){
            initSections(resp.result.sections);
            setPagginationHidden(false);
            setPrevDisabled(index <= 0);
          }
        }
        setLoading(false);
      })();
    }else{
      const packageType = Utils.packageTypeFromKey(currentKey);
      const type = Utils.typeFromKey(currentKey);
      const name = Utils.nameFromKey(currentKey);
      if (type !== undefined && name !== undefined){
        (async () => {
          const resp = await nfcRes.get(packageType, type, name, "", index, size);
          if(resp.success){
            if(resp.result && resp.result.sections !== undefined){
              initSections(resp.result.sections);
              setPagginationHidden(false);
              // TODO: check if need to setCurrentKey here
              setCurrentKey(Utils.formatKey(packageType, type, name));
              setPrevDisabled(index <= 0);
            }
          }
          setLoading(false);
        })();
        // alert( "showing NFC entries for: " + $scope.currentKey);
      }
    }
  };
  const changePageSize = currentSize => {
    updatePage({"size": currentSize, "index": 0});
    queryByPageIndexAndSize(page.current.index, page.current.size);
  };
  const changePageNumber = e => {
    if(e.keyCode === 13) {
      const pageIndex = parseInt(e.target.value, 10);
      updatePage({"index": pageIndex});
      queryByPageIndexAndSize(page.current.index, page.current.size);
    }
  };
  const prevPage = () => {
    const [curIndex, curSize] = [page.current.index-1, page.current.size];
    queryByPageIndexAndSize(curIndex, curSize);
    updatePage({"index": curIndex, "size": curSize});
  };
  const nextPage = () => {
    const curIndex = page.current.index + 1;
    queryByPageIndexAndSize(curIndex, page.current.size);
    updatePage({"index": curIndex});
  };

  const handleSearch = e => {
    const raw = rawSections.current;
    if (raw && raw.length > 0){
      const searchString = e.target.value;
      const newSections=[];
      raw.forEach(item => item.key.toLowerCase().includes(searchString.toLowerCase()) && newSections.push(item));
      setSections(newSections);
    }
  };

  return <Fragment>
    <div className="control-panel">
      {
        loadingSection && <LoadingSpiner />
      }
      <div className="cp-row">
        Not-Found Cache Entries for:
      </div>
      <div className="cp-row">
        <select role="nfcSel" value={currentKey}
          onChange={showSection}>
          <option value=""></option>
          {
            nfcStoreKeys.map(key => <option key={`storeKey:${key}`} label={Utils.keyLabel(key)} value={`${key}`}>{Utils.keyLabel(key)}</option>)
          }
        </select>{' '}
      </div>
      <div className="cp-row">
        <button onClick={showAll}>Show All</button>
        <button onClick={clearAllNFC}>Clear All</button>
      </div>
      <hr/>
      <div className="cp-row">
        Search: <input type="text" name="query" onChange={handleSearch}/>
      </div>
      <hr/>
      <div className="cp-row cp-debug">
        <input type="checkbox"/> Debug Data
      </div>
    </div>
    <div className="content-panel">
      {loading && <LoadingSpiner />}
      {message && message.trim() !== "" && <div className="alert alert-success" role="alert">{message}</div>}
      {error && error.trim() !== "" && <div className="alert alert-danger" role="alert">{error}</div>}
      {(message && message.trim() !== "" || error && error.trim() !== "") && <hr />}
      {
        sections && sections.length > 0 &&
        <ul>
          {
            sections.map(section => <li key={section.key} role={`section-${section.key}`} className="section">
              <div className="with-inline-cp">
                <div className="inline key">{section.label}</div>
                <div className="inline inline-cp">
                  <a href="" onClick={e =>{
                    e.preventDefault();
                    clearSection(section, sections);
                  }} className="inline-cp-action">&#x2718;</a>
                </div>
              </div>
              {
                section.paths && section.paths.length > 0 && <ul>
                  {
                    section.paths.map(path =><li key={path}>
                      <div className="with-inline-cp">
                        <div className="inline label">{path}</div>
                        <div className="inline inline-cp">
                          <a href="" onClick={e=>{
                            e.preventDefault();
                            clearSectionPath(section, path);
                          }} className="inline-cp-action">&#x2718;</a>
                        </div>
                      </div>
                    </li>)
                  }
                </ul>
              }
            </li>)
          }
        </ul>
      }
      {
        !paginationHidden && <div className="pagination">
          <label>Page Size:</label>&nbsp;
          <select value={page.current.size} onChange={e => {
            changePageSize(e.target.value);
          }}>
            {
              pageSizes.map(pageSize => <option key={pageSize} value={pageSize}>{pageSize}</option>)
            }
          </select>&nbsp;&nbsp;&nbsp;
          {
            !prevDisabled && <Fragment><input type="button" value="Prev" onClick={prevPage} />&nbsp;</Fragment>
          }
          <input type="number" style={{width: "50px"}} defaultValue={page.current.index} onKeyDown={changePageNumber}/>&nbsp;
          <input type="button" value="Next" onClick={nextPage} />
        </div>
      }
    </div>
  </Fragment>;
}
