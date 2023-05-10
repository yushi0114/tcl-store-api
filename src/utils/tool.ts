import { Recordable } from './../../types/global';
import { isArray, isObject, isFunction} from './inference';
import _ from 'ts-lodash';
import xlsx from 'node-xlsx';
import { ExportExcelParams } from 'types';

const { cloneDeep, isEqual, mergeWith, unionWith } = _;

export const noop = () => {};
/**

 递归合并两个对象。
 Recursively merge two objects.
 @param target 目标对象，合并后结果存放于此。The target object to merge into.
 @param source 要合并的源对象。The source object to merge from.
 @returns 合并后的对象。The merged object.
 */
export function deepMerge<
  T extends object | null | undefined,
  U extends object | null | undefined
>(target: T, source: U): T & U {
  return mergeWith(cloneDeep(target), source, (objValue, srcValue) => {
    if (isObject(objValue) && isObject(srcValue)) {
      return mergeWith(
        cloneDeep(objValue),
        srcValue,
        (prevValue, nextValue) => {
          // 如果是数组，合并数组(去重) If it is an array, merge the array (remove duplicates)
          return isArray(prevValue)
            ? unionWith(prevValue, nextValue, isEqual)
            : undefined;
        }
      );
    }
  });
}

/**
 * 数据对象key 驼峰下划线相互转化
 * @param {Object} data - 原始对象 支持-数组、key-value对象、字符串
 * @param {String} type hump-转驼峰 toLine-转下划线
 */
export function formatHumpLineTransfer<T = any>(
  data: T,
  type: 'hump' | 'toLine' = 'hump'
) {
  let hump = '';
  // 转换对象中的每一个键值为驼峰的递归
  let formatTransferKey = (data: T) => {
    if (data instanceof Array) {
      data.forEach((item) => formatTransferKey(item));
    } else if (data instanceof Object) {
      for (let key in data) {
        hump = type === 'hump' ? formatToHump(key) : formatToLine(key);
        (data as any)[hump] = (data as any)[key];
        if (key !== hump) {
          delete (data as any)[key];
        }
        if ((data as any)[hump] instanceof Object) {
          formatTransferKey((data as any)[hump]);
        }
      }
    } else if (typeof data === 'string') {
      (data as string) =
        type === 'hump' ? formatToHump(data) : formatToLine(data);
    }
  };
  formatTransferKey(data);
  return data;
}

/**
 * 字符串下划线转驼峰
 * @param {String} value 需要转换的值
 */
function formatToHump(value: string) {
  return value.replace(/\_(\w)/g, (_, letter) => letter.toUpperCase());
}

/**
 * 字符串驼峰转下划线
 * @param {String} value
 */
function formatToLine(value: string) {
  return value.replace(/([A-Z])/g, '_$1').toLowerCase();
}

const hexList: string[] = [];
for (let i = 0; i <= 15; i++) {
  hexList[i] = i.toString(16);
}

export function buildUUID(): string {
  let uuid = '';
  for (let i = 1; i <= 36; i++) {
    if (i === 9 || i === 14 || i === 19 || i === 24) {
      uuid += '-';
    } else if (i === 15) {
      uuid += 4;
    } else if (i === 20) {
      uuid += hexList[(Math.random() * 4) | 8];
    } else {
      uuid += hexList[(Math.random() * 16) | 0];
    }
  }
  return uuid.replace(/-/g, '');
}

let unique = 0;
export function buildShortUUID(prefix = ''): string {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return prefix + '_' + random + unique + String(time);
}

/**
 * 对象扁平化
 */
export const flatten = (obj: Recordable) => {
  let result: any = {};
  let process = (key: string, value: any) => {
    // 首先判断是基础数据类型还是引用数据类型
    if (Object(value) !== value) {
      // 基础数据类型
      if (key) {
        result[key] = value;
      }
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        process(`${key}[${i}]`, value[i]);
      }
      if (value.length === 0) {
        result[key] = [];
      }
    } else {
      let objArr = Object.keys(value);
      objArr.forEach((item) => {
        process(key ? `${key}.${item}` : `${item}`, value[item]);
      });
      if (objArr.length === 0 && key) {
        result[key] = {};
      }
    }
  };
  process('', obj);
  return result;
};

/**
 * excel 导出
 * list:[{}]
 * headers:表头中文名
 * headerKeys:与表头中文名一一对应的数据区key
 * tableName：导出的表名称以什么开头
 */
export const excelExport = ({
  list,
  headers,
  headerKeys,
  tableName = 'excel',
  changDictExport = {},
}: ExportExcelParams) => {
  // excel 通用样式
  const sheetOptions = { '!cols': [] };
  headers.forEach(() => {
    (sheetOptions['!cols'] as any).push({
      wch: 20,
    });
  });
  const data = [];
  list.forEach((item) => {
    let arr: any[] = [];
    const item2 = flatten(item);
    headerKeys.forEach((key) => {
      if (changDictExport[key] && isFunction(changDictExport[key])) {
        arr.push(changDictExport[key]([item[key]]));
      } else if (changDictExport[key]) {
        arr.push(changDictExport[key][item[key]]);
      } else {
        arr.push(item2[key]);
      }
    });
    data.push(arr);
  });
  data.unshift(headers);
  const buffer = xlsx.build(
    [{ options: {}, name: `${tableName}_${new Date().valueOf()}`, data: data }],
    { sheetOptions }
  );
  return buffer;
};

export const arrayToObject = (arr: any[]) => {
  const obj: Recordable = {};
  arr.forEach((item) => {
    obj[item.value] = item.label;
  });
  return obj;
};