import { envs } from './envs';

export const TITLE = 'Payment Gateway';
export const DESCRIPTION = `Payment Gateway API`;
export const VERSION = 'v1';
export const PREFIX = 'api';
export const { PORT } = envs;
export const SERVERS = [
  {
    host: `http://localhost:${PORT}`,
    description: 'Local',
  },
];
