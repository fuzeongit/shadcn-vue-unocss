declare namespace Mock {
  interface RestfulResult<T> {
    data: T;
    status: number;
    message: string;
  }
  interface Pagination<T> {
    countId: string;
    current: number;
    maxLimit: null;
    optimizeCountSql: boolean;
    orders: [];
    searchCount: boolean;
    size: number;
    total: number;
    records: T[];
  }

  interface UserAccount {
    id: string;
    createBy: string;
    createTime: string; // 日期时间通常用 string 表示，若需要可以进一步使用 Date 类型
    updateBy: string;
    updateTime: string;
    status: number; // 如果 status 是固定值的枚举类型，可使用具体的联合类型，如 "1" | "0"
    roleName: string;
    roleCode: string;
    roleDesc: string;
  }
}
