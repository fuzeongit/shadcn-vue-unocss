declare namespace Service {
  interface ServiceConfigItem {
    /** The backend service base url */
    baseURL: string;
    /** The proxy pattern of the backend service base url */
    proxyPattern: string;
  }
  interface RestfulResult<T = unknown> {
    data: T;
    code: number;
    message?: string;
  }
  interface Pageable {
    pageNumber: number;
    pageSize: number;
  }

  interface Pagination<T> {
    last: boolean;
    pageable: Pageable;
    totalElements: number;
    content: T[];
  }
}
