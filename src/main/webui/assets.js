/*
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
const CSS = [
  'node_modules/html5-boilerplate/dist/css/normalize.css',
  'node_modules/html5-boilerplate/dist/css/main.css',
  'node_modules/ng-dialog/css/ngDialog.css',
  'node_modules/ng-dialog/css/ngDialog-theme-default.css',
  'node_modules/bootstrap/dist/css/bootstrap.min.css',
  'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',  
  {"from":"src/app/css/", "to":"css/"}
];
const JS = [
  'node_modules/angular/angular.min.js',
  'node_modules/angular-route/angular-route.min.js',
  'node_modules/html5-boilerplate/dist/js/vendor/modernizr-2.8.3.min.js',
  'node_modules/angular-resource/angular-resource.min.js',
  'node_modules/ng-dialog/js/ngDialog.min.js',
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/bootstrap/dist/js/bootstrap.min.js',  
  {"from":"src/app/js/", "to":"js/"}
];
const IMG=[  
  {"from":"src/app/img/", "to":"img/"}
];
const OTHER=[
  {"from":"src/app/index.html", "to":"index.html"},
  {"from":"src/app/partials/", "to":"partials/"},
  {"from":"src/app/keycloak.json", "to":"keycloak.json"}
]

module.exports = [...JS, ...CSS, ...IMG, ...OTHER];
