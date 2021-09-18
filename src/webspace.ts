import { DeployConfig, FtpDeployConfig } from './types';
import { uploadSftp } from './utils';

interface WebspaceOptions {
  host?: string;
  username?: string;
  password?: string;
  localDir?: string;
  remoteDir?: string;
  include?: string[];
  exclude?: string[];
}

const INCLUDE_DEFAULTS = ['*', '**/*', '.*']; // includes ALL files, including dot files
const EXCLUDE_DEFAULTS = [
  'dist/**/*.map',
  'node_modules/**',
  'node_modules/**/.*',
  '.git/**',
]; // exludes all .map files and every file in .git & node_modules folder

export default class WebspaceDeploy {
  ftpConfig: FtpDeployConfig;

  constructor(options: WebspaceOptions = {}) {
    const {
      username = '',
      password = '',
      host = '',
      localDir = undefined,
      remoteDir = '/',
      include = INCLUDE_DEFAULTS,
      exclude = EXCLUDE_DEFAULTS,
    } = options;

    this.ftpConfig = {
      user: username,
      password,
      host,
      port: 22,
      localRoot: localDir,
      remoteRoot: remoteDir,
      include,
      exclude,
      deleteRemote: false,
      sftp: true,
    };
  }

  async deploy(options: DeployConfig = {}): Promise<void> {
    return await uploadSftp({ ...this.ftpConfig, ...options });
  }
}
