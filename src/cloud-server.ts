import { NodeSSH, Config } from 'node-ssh';
import ora from 'ora';

import { FtpDeployConfig } from './types';
import { uploadFtp } from './utils';

const ssh = new NodeSSH();

interface CloudServerOptions {
  host?: string;
  username?: string;
  password?: string;
  localDir?: string;
  remoteDir?: string;
  include?: string[];
  exclude?: string[];
}

const INCLUDE_DEFAULTS = ['*', '**/*'];
const EXCLUDE_DEFAULTS = [
  'dist/**/*.map',
  'node_modules/**',
  'node_modules/**/.*',
  '.git/**',
];

export default class CloudServer {
  remoteDir: string;
  ftpConfig: FtpDeployConfig;
  sshConfig: Config;

  constructor(options: CloudServerOptions = {}) {
    const {
      username = '',
      password = '',
      host = '',
      localDir = undefined,
      remoteDir = '/var/www/',
      include = INCLUDE_DEFAULTS,
      exclude = EXCLUDE_DEFAULTS,
    } = options;

    this.remoteDir = remoteDir;

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
      forcePasv: true,
      sftp: true,
    };

    this.sshConfig = {
      host,
      port: 22,
      username,
      password,
    };
  }

  private async upload(options: FtpDeployConfig = {}) {
    uploadFtp({ ...this.ftpConfig, ...options });
  }

  private async sshConnect() {
    await ssh.connect(this.sshConfig);
  }

  private async install() {
    const spinner = ora('Installing packages...').start();

    try {
      await ssh.execCommand('npm ci', { cwd: this.remoteDir });
      spinner.succeed('Installed packages');
    } catch (error) {
      console.log(error);
      spinner.fail();
    }
  }

  private async restart() {
    const spinner = ora('Restarting the server...').start();

    try {
      await ssh.execCommand(
        'rm -rf tmp && mkdir tmp && touch tmp/restart.txt',
        {
          cwd: this.remoteDir,
        }
      );
      spinner.succeed('Server restarted');
    } catch (error) {
      spinner.fail();
    }
  }

  async deploy(options: FtpDeployConfig = {}): Promise<void> {
    try {
      await this.upload(options);
      await this.sshConnect();
      await this.install();
      await this.restart();
    } catch (error) {
      console.error(error);
    }
  }
}
