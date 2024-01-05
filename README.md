# Indy UI
Indy UI

## Prerequisite for building
1. jdk11
2. mvn 3.6.2+

## Prerequisite for debugging in local
1. docker 20+
2. docker-compose 1.20+
3. (Optional) Node 18+
4. (Optional) NPM 9+
5. (Optional) Visual Studio Code

## Configure 

see [src/main/resources/application.yaml](./src/main/resources/application.yaml) for details


## Try it

There are a few steps to set it up.

1. Build (make sure you use jdk11 and mvn 3.6.2+)
```
$ git clone indy-ui-service
$ cd indy-ui-service
$ mvn clean compile
```
2. Start in debug mode
```
$ mvn quarkus:dev
```

## Start to develop with node and npm

All frontend code is hosted in [src/main/webui](src/main/webui), so you can go into this folder and then use all npm command you are familiar. BTW, there are pre-defined npm script as following:
* `npm run build`: build the whole frontend application
* `npm run build-dev`: build the whole frontend application in development mode
* `npm run test`: run unit test
* `npm run server`: build the whole frontend application and start the local mock server with the built bundle. This is used to do local development with a mock REST server for all indy backend services. You can add any mock REST APIs for the frontend code consuming to do debug without to connect to real Indy backend services.
* `npm run lint`: do lint for all frontend code