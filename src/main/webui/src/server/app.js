import compression from 'compression';
import express from 'express';
import path from 'path';
import {Config} from './config/AppConfig';

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

// For store listing
app.get(`${STORE_API_BASE}/:packageType/:type`, (req, res) => {
  const [pkgType, type] = [req.params.packageType, req.params.type];
  const pkgToFileMapping = {"maven": "Maven", "npm": "NPM"};
  const typeToFileMapping = {"remote": "Remote", "hosted": "Hosted", "group": "Group"};
  let list = [];
  if(pkgType==="_all"){
    // TODO: do all packageType for type handling here
  }
  const mockFile = `./mock/list/Fake${pkgToFileMapping[pkgType]}${typeToFileMapping[type]}List.json`;
  list = require(mockFile);
  res.status(200).json(list);
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

app.get(`${STORE_API_BASE}/maven/remote/:name`, (req, res) => {
  const name = req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeMavenRemoteList.json');
    const result = remoteList.items.find(item=>item.name===name);
    if(result){
      res.status(200).json(result);
    }else{
      res.status(404).json({error: "No such store!"});
    }
  }else{
    res.status(400).json({error: "Missing store name"});
  }
});

app.get(`${STORE_API_BASE}/maven/hosted/:name`, (req, res) => {
  const name=req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeMavenHostedList.json');
    const result = remoteList.items.find(item=>item.name===name);
    if(result){
      res.status(200).json(result);
    }else{
      res.status(404).json({error: "No such store!"});
    }
  }else{
    res.status(400).json({error: "Missing store name"});
  }
});

app.get(`${STORE_API_BASE}/maven/group/:name`, (req, res) => {
  const name=req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeMavenGroupList.json');
    const result = remoteList.items.find(item=>item.name===name);
    if(result){
      res.status(200).json(result);
    }else{
      res.status(404).json({error: "No such store!"});
    }
  }else{
    res.status(400).json({error: "Missing store name"});
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

