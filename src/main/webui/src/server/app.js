import compression from 'compression';
import express from 'express';
import path from 'path';
import {Config} from './config/AppConfig';

const projectRoot = path.resolve(__dirname, '../../dist');
const indexHtml=path.join(projectRoot+'/index.html');

const app = express();
app.use(compression());
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

app.get('/api/admin/stores/_all/remote', (req, res) => {
  const remoteList = require('./mock/list/FakeRemoteList.json');
  res.status(200).json(remoteList);
});

app.get('/api/admin/stores/_all/hosted', (req, res) => {
  const hostedList = require('./mock/list/FakeHostedList.json');
  res.status(200).json(hostedList);
});

app.get('/api/admin/stores/_all/group', (req, res) => {
  const groupList = require('./mock/list/FakeGroupList.json');
  res.status(200).json(groupList);
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

app.get('/api/admin/stores/maven/remote/:name', (req, res) => {
  const name = req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeRemoteList.json');
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

app.get('/api/admin/stores/maven/hosted/:name', (req, res) => {
  const name=req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeHostedList.json');
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

app.get('/api/admin/stores/maven/group/:name', (req, res) => {
  const name=req.params.name;
  if(name){
    const remoteList = require('./mock/list/FakeGroupList.json');
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
