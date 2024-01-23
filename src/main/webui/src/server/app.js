/* eslint-disable no-console */
import compression from 'compression';
import express from 'express';
import path from 'path';
import {Config} from './config/AppConfig';
import {existsSync} from 'fs';

const projectRoot = path.resolve(__dirname, '../../dist');
const indexHtml=path.join(projectRoot+'/index.html');
const STORE_API_BASE = "/api/admin/stores";

const app = express();
app.use(compression());
app.use(express.json());
const server = app.listen(Config.SERVER_PORT, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
app.use(express.static('dist'));

// For direct url bar addressing, will send home page directly for client router rendering
app.get([Config.APP_ROOT, `${Config.APP_ROOT}/*`, '/'], (req, res) => {
    res.sendFile(indexHtml);
});

// stats APIs start
app.get('/api/stats/package-type/keys', (req, res)=>{
  res.status(200).json(["generic-http", "maven", "npm"]);
});

app.get('/api/stats/version-info', (req, res) => {
  res.status(200).json({
      version: "3.3.2",
      commitId: "f472176",
      builder: "test-builder",
      timestamp: "2023-10-24 05:54 +0000"
    });
});

app.get('/api/stats/all-endpoints', (req, res) => {
  const statsEndpointsFile = path.resolve(__dirname, `./mock/list/FakeAllEndPoints.json`);
  const list = require(statsEndpointsFile);
  res.status(200).json(list);
});

// stats APIs end

// endpoints and storekeys
app.get('/api/admin/stores/query/endpoints/:packageType', (req, res) => {
  const [pkgType] = [req.params.packageType];
  const statsEndpointsFile = path.resolve(__dirname, `./mock/list/FakeAllEndPoints.json`);
  const list = require(statsEndpointsFile);
  if (pkgType==="all"){
    res.status(200).json(list);
  }else{
    const filtered = {
      items: list.items.filter(i=>pkgType===i.packageType)
    };
    res.status(200).json(filtered);
  }
});

app.get('/api/admin/stores/query/storekeys/:packageType', (req, res) => {
  const [pkgType] = [req.params.packageType];
  const statsEndpointsFile = path.resolve(__dirname, `./mock/list/FakeAllEndPoints.json`);
  const list = require(statsEndpointsFile);
  if (pkgType==="all"){
    const keys = {
      items: list.items.map(i=>i.key)
    };
    res.status(200).json(keys);
  }else{
    const filteredKeys = {
      items: list.items.filter(i=>pkgType===i.packageType).map(i=>i.key)
    };
    res.status(200).json(filteredKeys);
  }
});


const decideMockListFile = (packgeType, type) => {
  const pkgToFileMapping = {"maven": "Maven", "generic-http": "Generic", "npm": "NPM"};
  const typeToFileMapping = {"remote": "Remote", "hosted": "Hosted", "group": "Group"};
  return path.resolve(__dirname, `./mock/list/Fake${pkgToFileMapping[packgeType]}${typeToFileMapping[type]}List.json`);
};


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// For store listing
app.get(`${STORE_API_BASE}/:packageType/:type`, async (req, res) => {
  await sleep(2000);
  const [pkgType, type] = [req.params.packageType, req.params.type];
  if(pkgType==="_all"){
    // TODO: do all packageType for type handling here
  }
  const mockFile = decideMockListFile(pkgType, type);
  if(existsSync(mockFile)){
    const list = require(mockFile);
    res.status(200).json(list);
  }else{
    res.status(404).json({error: "No such stores!"});
  }
});

// For single store get
app.get(`${STORE_API_BASE}/:packageType/:type/:name`, async (req, res) => {
  await sleep(1000);
  const [pkgType, type, name] = [req.params.packageType, req.params.type, req.params.name];
  if(pkgType && type && name){
    const mockListFile = decideMockListFile(pkgType, type);
    if(existsSync(mockListFile)){
      const repoList = require(mockListFile);
      const result = repoList.items.find(item=>item.name===name);
      if(result){
        res.status(200).json(result);
      }else{
        res.status(404).json({error: "No such store!"});
      }
    }else{
      res.status(404).json({error: "No such stores!"});
    }
  }else{
    res.status(400).json({error: "Missing store name"});
  }
});

app.get('/api/admin/schedule/store/all/disable-timeout', (req, res) => {
  const disableTimeouts = require('./mock/FakeDisableTimeouts.json');
  res.status(200).json(disableTimeouts);
});

app.get('/api/admin/schedule/store/:packageType/:type/:name/disable-timeout', (req, res) => {
  const group = `${req.params.packageType}:${req.params.type}:${req.params.name}`;
  if(group && group.length > 0){
    const disList = require('./mock/FakeDisableTimeouts.json');
    const result = disList.items.find(item=>item.group.includes(group));
    if(result){
      res.status(200).json(result);
    }else{
      res.status(404).json({error: "No such store!"});
    }
  }
});

// const newFakeRepo = (packageType, type, name)=>{
//   const storeKey = `${packageType}:${type}:${name}`;
//   const repo = {
//     "packageType": `${packageType}`,
//     "type": `${type}`,
//     "name": `${name}`,
//     "key": `${storeKey}`,
//     "description": `This is a fake repo for ${storeKey}`,
//     "disabled": false,
//     "disable_timeout": 0,
//     "path_style": "plain",
//     "authoritative_index": false,
//     "prepend_constituent": false
//   };
//   return repo;
// };

app.post(`${STORE_API_BASE}/:packageType/:type/:name`, (req, res) => {
  const newRepo = req.body;
  if(req.headers['content-type']==="application/json"){
    if (newRepo.packageType&&newRepo.type&&newRepo.name){
      console.log(`${req.method} ${req.path}\n ${JSON.stringify(newRepo)}`);
      res.sendStatus(204);
    }else{
      res.status(400).json({error: "Bad repo request: missing packageType or type or name for repo!"});
    }
  }else{
    res.status(400).json({error: "Bad request: wrong header content-type"});
  }
});

app.put(`${STORE_API_BASE}/:packageType/:type/:name`, (req, res) => {
  const updatedRepo = req.body;
  if(req.headers['content-type']==="application/json"){
    if (updatedRepo.packageType&&updatedRepo.type&&updatedRepo.name){
      console.log(`${req.method} ${req.path}\n ${JSON.stringify(updatedRepo)}`);
      res.status(200).json(updatedRepo);
    }else{
      res.status(400).json({error: "Bad repo request: missing packageType or type or name for repo!"});
    }
  }else{
    res.status(400).json({error: "Bad request: wrong header content-type"});
  }
});

// Mock authentication
app.get('/api/admin/auth/userinfo', (req, res) => {
  const testUser = {userName: "indy", roles: ["admin", "power-user", "user"]};
  res.status(200).json(testUser);
});
