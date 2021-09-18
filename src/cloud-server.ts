import { NodeSSH, Config } from 'node-ssh';
import ora from 'ora';

import { DeployConfig, FtpDeployConfig } from './types';
import { execRestart, uploadSftp } from './utils';

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

const INCLUDE_DEFAULTS = ['*', '**/*']; // includes ALL files, except dot files
const EXCLUDE_DEFAULTS = [
  'dist/**/*.map',
  'node_modules/**',
  'node_modules/**/.*',
  '.git/**',
]; // exludes all .map files and every file in .git & node_modules folder

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

  private async sshConnect() {
    await ssh.connect(this.sshConfig);
  }

  async upload(options: DeployConfig = {}): Promise<void> {
    return await uploadSftp({ ...this.ftpConfig, ...options });
  }

  async install(): Promise<void> {
    if (!ssh.isConnected()) {
      await this.sshConnect();
    }

    const spinner = ora('Installing packages...').start();

    try {
      await ssh.execCommand('npm ci', { cwd: this.remoteDir });
      spinner.succeed('Installed packages');
    } catch (error) {
      console.log(error);
      spinner.fail();
    }
  }

  async restart(): Promise<void> {
    if (!ssh.isConnected()) {
      await this.sshConnect();
    }

    const spinner = ora('Restarting the server...').start();

    try {
      await execRestart(ssh, this.remoteDir);
      spinner.succeed('Server restarted');
    } catch (error) {
      spinner.fail();
    }
  }

  async deploy(options: DeployConfig = {}): Promise<void> {
    try {
      await this.upload(options);
      await this.install();
      await this.restart();
    } catch (error) {
      console.error(error);
    }
    process.exit();
  }
}
