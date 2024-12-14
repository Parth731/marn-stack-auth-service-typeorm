import { Config } from './config/index.js';

export const greet = (name: string): string => {
  return `Hello, ${name}! Welcome to ${Config.PORT} ${Config.NODE_ENV}`;
};

console.log(greet('World'));
