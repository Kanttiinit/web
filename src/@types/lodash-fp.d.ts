declare module 'lodash/fp/get' {
  export default function(path: string | string[], item: any): any;
}

declare module 'lodash/fp/set' {
  export default function(key: string | string[], value: any, item: any): void;
}

declare module 'lodash/fp/orderBy' {
  export default function<T>(sortKey: string, sortDirection: string, array: T[]): T[];
}
