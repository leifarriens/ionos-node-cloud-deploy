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

/**
 * removing unnecessary options:
 * - pgk only uses sftp
 * - host, username and password should be configured in constructor
 * - uploading to a different host or ssh login should be handled with new instance
 */
type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DeployConfig
  extends Omit<
    FtpDeployConfig,
    'host' | 'user' | 'password' | 'port' | 'sftp' | 'forcePasv'
  > {}
