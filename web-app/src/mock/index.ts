import { setupWorker } from 'msw/browser';
import { handlers } from './api';

export const DEFAULT_DELAY_MILLISECONDS = 500;
export const worker = setupWorker(...handlers);



