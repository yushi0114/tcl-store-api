export type Writable<T> = {
  -readonly [P in keyof T]: T[P];
};

export type Nullable<T> = T | null;
export type NonNullable<T> = T extends null | undefined ? never : T;
export type Recordable<T = any> = Record<string, T>;
export type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};
export type Indexable<T = any> = {
  [key: string]: T;
};
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
export type TimeoutHandle = ReturnType<typeof setTimeout>;
export type IntervalHandle = ReturnType<typeof setInterval>;

export interface ChangeEvent extends Event {
  target: HTMLInputElement;
}

export interface WheelEvent {
  path?: EventTarget[];
}
interface ImportMetaEnv extends ViteEnv {
  __: unknown;
}

export interface ViteEnv {
  APP_PORT?: string;
  MYSQL_HOST?: string;
  MYSQL_PORT?: string;
  MYSQL_DATABASE?: string;
  MYSQL_USER?: string;
  MYSQL_PASSWORD?: string;
}
