const { Command } = require('commander');
const { CloudDeploy } = require('../dist');

const commander = new Command();

commander
  .version('0.0.1')
  .description('Ionos cloud server node app deploy')
  .option('-host, --host [host]', 'SSH host')
  .option('-u, --username [username]', 'SSH username')
  .option('-p, --password [password]', 'SSH password')
  .option('-l --localDir [localDir]', 'localDir')
  .option('-r --remoteDir [remoteDir]', 'remoteDir')
  .option('-i --include [include]', 'include folders')
  .option('-e --exclude [exclude]', 'exclude folders');

commander.parse();

const options = commander.opts();

options['localDir'] = __dirname + options.localDir;
options['include'] = options.include.split(',');
options['exclude'] = options.exclude.split(',');

const cloud = new CloudDeploy(options);

cloud.deploy();
