import { FtpDeployConfig } from './types';
import { uploadFtp } from './utils';

interface WebspaceOptions {
  host?: string;
  username?: string;
  password?: string;
  localDir?: string;
  remoteDir?: string;
  include?: string[];
  exclude?: string[];
}

const INCLUDE_DEFAULTS = ['*', '**/*', '.*'];
const EXCLUDE_DEFAULTS = [
  'dist/**/*.map',
  'node_modules/**',
  'node_modules/**/.*',
  '.git/**',
];

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

  deploy(options: FtpDeployConfig = {}): void {
    uploadFtp({ ...this.ftpConfig, ...options });
  }
}
