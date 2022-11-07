declare const IS_PRODUCTION: boolean;
declare const API_BASE: string;
declare const VERSION: string;
declare const PUBLIC_ASSET_PATH: string;

export const isProduction = import.meta.env.PROD;
export const apiBase = import.meta.env.API_BASE;
export const version = import.meta.env.VERSION;
export const isBeta = location.hostname === 'beta.kanttiinit.fi';
export const publicAssetPath = PUBLIC_ASSET_PATH;
