import FtpDeploy from 'ftp-deploy';
import ora from 'ora';
import chalk from 'chalk';
import { NodeSSH, SSHExecCommandResponse } from 'node-ssh';

import { FtpDeployConfig } from './types';

const ftp = new FtpDeploy();

interface UploadingEvent {
  transferredFileCount: number;
  totalFilesCount: number;
}

export async function uploadSftp(config: FtpDeployConfig): Promise<void> {
  const spinner = ora(`Connecting to ${config.host}`).start();

  ftp.on('uploading', function (data: UploadingEvent) {
    spinner.text = `Uploaded ${chalk.blue(
      data.transferredFileCount
    )} of ${chalk.blue(data.totalFilesCount)} files to ${config.host} ${
      config.remoteRoot
    }`;
  });

  try {
    const uploaded = await ftp.deploy(config);

    const nOfFolders = uploaded.length;
    const nOfFiles = uploaded.reduce(
      (acc: number, curr: string[]) => acc + curr.length,
      0
    );
    spinner.succeed(
      `Uploaded ${chalk.blue(nOfFiles)} files from ${chalk.blue(
        nOfFolders
      )} directories`
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    spinner.fail(error.code);
  }
}

export const execRestart = async (
  ssh: NodeSSH,
  dir: string
): Promise<SSHExecCommandResponse> =>
  await ssh.execCommand('rm -rf tmp && mkdir tmp && touch tmp/restart.txt', {
    cwd: dir,
  });
