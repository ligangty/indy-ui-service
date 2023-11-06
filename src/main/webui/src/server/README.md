# UI Mock Server

This mock server is used for frontend testing. It is served as a mock backend to provide mock data for frontend component data fetching

## How to run

Use

```bash
npm run server
```

to start the server

## How to add your mocking data

1. Add your mock data in mock folder, for example: [mock/list/FakeRemoteList.json](mock/list/FakeRemoteList.json) is for the remote listing mock data
2. Add code to provide your mock data through express server code with correct http providers. For details, please check the [app.js](app.js) for details.
