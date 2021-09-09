export interface FtpDeployConfig {
  host?: string;
  user?: string;
  password?: string;
  port?: number;
  localRoot?: string | undefined;
  remoteRoot?: string;
  include?: string[];
  exclude?: string[];
  deleteRemote?: boolean;
  forcePasv?: boolean;
  sftp?: boolean;
}
