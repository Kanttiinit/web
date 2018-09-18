declare const IS_PRODUCTION: boolean;
declare const API_BASE: string;
declare const VERSION: string;

export const isProduction = IS_PRODUCTION;
export const apiBase = API_BASE;
export const version = VERSION;
export const isBeta =
  location.hostname === 'beta.kanttiinit.fi' ||
  location.hostname === 'localhost';
