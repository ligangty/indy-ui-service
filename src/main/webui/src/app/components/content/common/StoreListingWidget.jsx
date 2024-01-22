/**
 * Copyright (C) 2024 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
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

import React, {Fragment, useState} from 'react';
import {Link} from 'react-router-dom';
import {PropTypes} from 'prop-types';
import {Utils} from '#utils/AppUtils.js';

const LocalURLSection = ({storeKey}) => <div className="left-half">
    <label>Local URL:</label>{' '}
    <a href={Utils.storeHref(storeKey)} target="_new">{Utils.storeHref(storeKey)}</a>
  </div>;

LocalURLSection.propTypes = {
  storeKey: PropTypes.string
};

// For options, see AppUtils.remoteOptions|hostedOptions
const CapabilitiesSection = ({store}) => {
  if(store.type==="remote" || store.type==="hosted"){
    const options = Utils.storeOptions(store);
    const styleClass = store.type==="remote"?"left-half":"right-half";
    return <div className={styleClass}>
      <label>Capabilities:</label>{' '}
      {
        options.map(option => <div key={option.title} className="options">
            <span className="key">{option.icon} </span>
          </div>)
      }
    </div>;
  }
  return <Fragment/>;
};

CapabilitiesSection.propTypes = {
  store: PropTypes.object
};

const ConstituentsSection = ({constituents}) => {
  const [showConstituents, setShowConstituents] = useState(false);

  return <div className="right-half">
    <div className="inline-label">
      {constituents.length} Constituent(s) [
      <span className="option">
        <a href="" onClick={e => {
          e.preventDefault();
          setShowConstituents(!showConstituents);
        }}>{showConstituents ? '-' : '+'}</a>
      </span>
      ]
    </div>
    {
      showConstituents &&
      <ol className="content-panel item-expanded subsection">
        {
          constituents.map(item => <li key={`constituent-${item}`} className="detail-value-list-item">
            <Link to={Utils.detailHref(item)}>{item}</Link>
            {Utils.typeFromKey(item) === "remote" && <div className="subfields">
              <span className="description field">(Remote URL: <Link to={Utils.storeHref(item)}>{Utils.storeHref(item)}</Link>)</span>
            </div>}
          </li>)
        }
      </ol>
    }
  </div>;
};

ConstituentsSection.propTypes = {
  constituents: PropTypes.array
};

const StoreNameSection = ({store, storeClass}) => <div className="fieldset-caption">
    <Link to={`/${store.type}/${store.packageType}/view/${store.name}`}>
      <span className={storeClass}>{store.packageType}-{store.name}</span>
    </Link>
  </div>;

StoreNameSection.propTypes = {
  store: PropTypes.object,
  storeClass: PropTypes.string
};

const StoreListingWidget = ({storeList, disableMap, storeType}) => {
  const listing = storeList;
  const disMap = disableMap;
  if(listing && listing.length >0){
    return (
      <div className="content-panel">
        <div className="store-listing">
          {
            listing.map(store => {
              const storeClass = Utils.isDisabled(store.key, disMap)? "disabled-store":"enabled-store";
              return (
                <div key={store.key} className="store-listing-item">
                  <StoreNameSection store={store} storeClass={storeClass} />
                  <div className="fieldset">
                    <div>
                      <LocalURLSection storeKey={store.key} />
                      {
                        storeType === "remote" && <div className="right-half">
                          <label>Remote URL:</label>
                          <a href={store.url} target="_new">{store.url}</a>
                        </div>
                      }
                      { storeType === "hosted" && <CapabilitiesSection store={store} />}
                      { storeType === "group" && <ConstituentsSection constituents={store.constituents?store.constituents:[]} />}
                    </div>
                    {
                      storeType === "remote" && <div><CapabilitiesSection store={store} /></div>
                    }
                    <div className="description field"><span>{store.description}</span></div>
                  </div>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
  return <Fragment></Fragment>;
};

StoreListingWidget.propTypes = {
  storeList: PropTypes.array,
  disableMap: PropTypes.object,
  storeType: PropTypes.string
};

export {StoreListingWidget};
