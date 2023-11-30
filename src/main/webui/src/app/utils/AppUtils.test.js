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

import {Utils} from "./AppUtils.js";


describe('AppUtils tests', () => {
  it('Utils.remoteOptions check', () => {
    const remoteStore = {name: "central", type: "remote", packageType: "maven",
       key: "maven:remote:central", disabled: false, "allow_snapshots": true,
       "allow_releases": true};
    expect(Utils.remoteOptions(remoteStore)).toEqual([
      {icon: 'S', title: 'Snapshots allowed'},
      {icon: 'R', title: 'Releases allowed'}
    ]);
  });

  it('Utils.hostedOptions check', () => {
    const hostedStore = {name: "local-deployments", type: "hosted", packageType: "maven",
       key: "maven:hosted:local-deployments", disabled: false, "allow_snapshots": true,
       "allow_releases": true};
    expect(Utils.hostedOptions(hostedStore)).toEqual([
      {icon: 'S', title: 'Snapshots allowed'},
      {icon: 'R', title: 'Releases allowed'},
      {icon: 'D', title: 'Deployment allowed'}
    ]);
  });

  it('Check key extract functions', () => {
    expect(Utils.typeFromKey("maven:remote:central")).toEqual("remote");
    expect(Utils.nameFromKey("maven:hosted:local-deployments")).toEqual("local-deployments");
    expect(Utils.packageTypeFromKey("maven:hosted:local-deployments")).toEqual("maven");
  });

  it('Check storeHref', () => {
    expect(Utils.storeHref("maven:remote:central")).toEqual("http://localhost/api/content/maven/remote/central");
  });

  it('Check setDisableTimeout', () => {
    const mockData =
    {
      "items": [
        {
        "name": "Disable-Timeout",
        "group": "generic-http:hosted:h-indy-admin-psi-redhat-com-build-AUS3NFFVLVQAI#Disable-Timeout",
        "expiration": "2019-02-22T17:00:00.000Z"
        },
        {
          "name": "Disable-Timeout",
          "group": "maven:hosted:build-ASEQKQ6PXEABW#Disable-Timeout",
          "expiration": "2020-02-22T17:00:00.000Z"
        }
      ]
    };
    const disMap = Utils.setDisableMap(mockData);
    expect(disMap["generic-http:hosted:h-indy-admin-psi-redhat-com-build-AUS3NFFVLVQAI"]).toEqual('2019-02-22T17:00:00.000Z');
    expect(disMap["maven:hosted:build-ASEQKQ6PXEABW"]).toEqual('2020-02-22T17:00:00.000Z');
  });

  it("Check reConstituents", () => {
    const mockData = {
      name: "test", type: "group", packageType: "maven", key: "maven:group:test",
      constituents: ["maven:remote:central", "maven:hosted:local-deployments"]
    };
    const constituents = Utils.reConstituents(mockData);
    expect(constituents).toContainEqual({key: "maven:remote:central",
     type: "remote", packageType: "maven", name: "central",
     detailHref: "/remote/maven/view/central",
     storeHref: "http://localhost/api/content/maven/remote/central"});
     expect(constituents).toContainEqual({key: "maven:hosted:local-deployments",
     type: "hosted", packageType: "maven", name: "local-deployments",
     detailHref: "/hosted/maven/view/local-deployments",
     storeHref: "http://localhost/api/content/maven/hosted/local-deployments"});
  });

  it("Check searchByKeyForNewStores", ()=>{
    const mockData = [
      {
      "name": "central",
      "type": "remote",
      "packageType": "maven",
      "key": "maven:remote:central"
      },
      {
      "name": "test",
      "type": "group",
      "packageType": "maven",
      "key": "maven:group:test"
      },
      {
      "name": "local-deployments",
      "type": "hosted",
      "packageType": "maven",
      "key": "maven:hosted:local-deployments"
      }
    ];
    expect(Utils.searchByKeyForNewStores("maven:group:test", mockData)).toEqual([
      {
      "name": "test",
      "type": "group",
      "packageType": "maven",
      "key": "maven:group:test"
      }
    ]);
    expect(Utils.searchByKeyForNewStores("maven:remote:central", mockData)).toEqual([
      {
      "name": "central",
      "type": "remote",
      "packageType": "maven",
      "key": "maven:remote:central"
      }
    ]);
    expect(Utils.searchByKeyForNewStores("maven:hosted:local-deployments", mockData)).toEqual([
      {
      "name": "local-deployments",
      "type": "hosted",
      "packageType": "maven",
      "key": "maven:hosted:local-deployments"
      }
    ]);
  });

  it("Check sortByPropForStores", ()=>{
    const mockData = [
      {
      "name": "central",
      "type": "remote",
      "packageType": "maven",
      "key": "maven:remote:central",
      "url": "https://repo.maven.apache.org/maven2"
      },
      {
      "name": "mrrc",
      "type": "remote",
      "packageType": "maven",
      "key": "maven:remote:mrrc",
      "url": "https://maven.repository.redhat.com/ga/"
      },
      {
      "name": "jboss.org",
      "type": "remote",
      "packageType": "maven",
      "key": "maven:remote:jboss.org",
      "url": "https://repository.jboss.org/nexus/content/repositories/"
      }
    ];
    const sortByName = Utils.sortByPropForStores("name", mockData);
    expect(sortByName).toHaveLength(3);
    expect(sortByName[0].name).toBe("central");
    expect(sortByName[2].name).toBe("mrrc");

    const sortByUrl = Utils.sortByPropForStores("url", mockData);
    expect(sortByUrl).toHaveLength(3);
    expect(sortByUrl[0].name).toBe("mrrc");
    expect(sortByUrl[2].name).toBe("jboss.org");
  });

  it("Check Object utils", () => {
    expect(Utils.isEmptyObj({})).toBeTruthy();
    expect(Utils.isEmptyObj({a: 1})).toBeFalsy();
    expect(Utils.isEmptyObj({"": ""})).toBeFalsy();

    expect(Utils.cloneObj({})).toEqual({});
    expect(Utils.cloneObj({a: "1"})).toEqual({a: "1"});
    expect(Utils.cloneObj({a: "1", b: "2"})).toEqual({b: "2", a: "1"});
    expect(Utils.cloneObj({a: {b: "2"}, c: ["3", "4"]})).toEqual({c: ["3", "4"], a: {b: "2"}});
  });

});
