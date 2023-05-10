import { Nullable, Recordable } from './global';

export * from './global';
export * from './axios';

export interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

export interface PromiseFn<T = any, R = T> {
  (...arg: T[]): Promise<R>;
}

export type RefType<T> = T | null;

export type LabelValueOptions<V extends string | number | boolean> = {
  label: string;
  value: V;
  [key: string]: string | number | boolean;
}[];

export type EmitType = (event: string, ...args: any[]) => void;

export type TargetContext = '_self' | '_blank';

export interface ComponentElRef<T extends HTMLElement = HTMLDivElement> {
  $el: T;
}

export type ComponentRef<T extends HTMLElement = HTMLDivElement> =
  ComponentElRef<T> | null;

export type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;

export interface ExportExcelParams {
  list: Recordable[];
  headers: string[];
  headerKeys: string[];
  tableName?: string;
  changDictExport?: Recordable;
}