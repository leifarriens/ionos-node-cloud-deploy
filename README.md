
# ionos-node-cloud-deploy

This modules helps you deploy a NodeJS application to your ionos Cloud Server or Webspace.
It expects you to run your Cloud Server with [Passenger](https://www.phusionpassenger.com/docs/tutorials/what_is_passenger/ "Phusion Passenger Docs").

## Installation

With npm

```bash
npm install ionos-node-cloud-deploy
```

With yarn

```bash
yarn add ionos-node-cloud-deploy
```

## Features

* Uploading files via sftp
* Installing dependencies
* Restarting the Server

## Usage/Examples

### Cloud Server

```javascript
  const { CloudServer } = require('ionos-node-cloud-deploy');

  const cloud = new CloudServer({
    host: 'hostname',
    username: 'username',
    password: 'password',
    localDir: __dirname + '/build',
    include: ['*.js', '*.ejs', '*.json', 'public/*']
  });

  cloud.deploy();
```

| Parameter   | Type       | Description                                                                                          |
| :---------- | :--------- | :--------------------------------------------------------------------------------------------------- |
| `host`      | `string`   | **Required**. Hostname of the cloud server                                                           |
| `username`  | `string`   | **Required**. SSH username                                                                           |
| `password`  | `string`   | **Required**. SSH password                                                                           |
| `localDir`  | `string`   | **Required**. local directory `__dirname + '/dist'`                                                  |
| `remoteDir` | `string`   | remote directory - **default**: `'/var/www/'`                                                        |
| `include`   | `string[]` | files to include - **default**: `['*', '**/*']`                                                      |
| `exclude`   | `string[]` | files to exclude - **default**: `['dist/**/*.map','node_modules/**','node_modules/**/.*','.git/**']` |

Deploy functions can be executed step by step.

```javascript
  await cloud.upload();
  await cloud.install();
  await cloud.restart();
```

### Webspace

```javascript
const { Webspace } = require('ionos-node-cloud-deploy');

const webspace = new Webspace({
  host: DEPLOY_HOSTNAME,
  username: DEPLOY_USERNAME,
  password: DEPLOY_PASSWORD,
  localDir: __dirname + '/dist',
  remoteDir: '/upload'
});

webspace.deploy({ deleteRemote: true });
```

| Parameter   | Type       | Description                                                                                          |
| :---------- | :--------- | :--------------------------------------------------------------------------------------------------- |
| `host`      | `string`   | **Required**. Hostname of the cloud server                                                           |
| `username`  | `string`   | **Required**. SSH username                                                                           |
| `password`  | `string`   | **Required**. SSH password                                                                           |
| `localDir`  | `string`   | **Required**. local directory `__dirname + '/dist'`                                                  |
| `remoteDir` | `string`   | remote directory - **default**: `'/'`                                                                |
| `include`   | `string[]` | files to include - **default**: `['*', '**/*', '.*']`                                                |
| `exclude`   | `string[]` | files to exclude - **default**: `['dist/**/*.map','node_modules/**','node_modules/**/.*','.git/**']` |
  
## Authors

* [@leifarriens](https://www.github.com/leifarriens)

## License

[MIT](../blob/main/LICENSE)
  