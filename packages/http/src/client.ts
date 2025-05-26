/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-constructor */
import { stringify } from 'qs';

type RestfulResult<V extends string, T = unknown> = {
  [K in V]: T; // 映射类型
};

export interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  headers?: Headers;
}

export interface HttpClientOptions {
  // 传入工厂，因为有些值是会变的，不能在声明的时候写死
  headersFactory?: () => Headers;
}

export abstract class HttpClient<K extends string, T extends RestfulResult<K>> {
  constructor(
    readonly host: string,
    readonly httpClientOptions: HttpClientOptions
  ) {}

  static getParamsString(options: RequestOptions) {
    return options.params
      ? `?${stringify(options.params, {
          arrayFormat: 'repeat'
        })}`
      : '';
  }

  protected getHeaders(headers: Headers) {
    const defaultHeaders = this.httpClientOptions?.headersFactory?.() ?? new Headers();
    defaultHeaders.forEach((v, k) => headers.append(k, v));
    return headers;
  }

  get<S>(url: string, options: RequestOptions = {}) {
    options.method = 'GET';
    return this.fetchPack(url, options) as Promise<RestfulResult<K, S> & T>;
  }

  post<S>(url: string, body: any, options: RequestOptions = {}) {
    options.method = 'POST';
    options.body = JSON.stringify(body);
    return this.fetchPack(url, options) as Promise<RestfulResult<K, S> & T>;
  }

  put<S>(url: string, body: any, options: RequestOptions = {}) {
    options.method = 'PUT';
    options.body = JSON.stringify(body);
    return this.fetchPack(url, options) as Promise<RestfulResult<K, S> & T>;
  }

  delete<S>(url: string, options: RequestOptions = {}) {
    options.method = 'DELETE';
    return this.fetchPack(url, options) as Promise<RestfulResult<K, S> & T>;
  }

  postForm<S>(url: string, body: FormData, options: RequestOptions = {}) {
    options.method = 'POST';
    options.body = body;
    return this.fetchPack(url, options) as Promise<RestfulResult<K, S> & T>;
  }

  //   fetch(url: string, options: RequestOptions) {
  //     return fromFetch(
  //       this.host + url + this._getParamsString(options),
  //       Object.assign(options, {
  //         headers: this._getHeaders(options?.headers ?? new Headers())
  //       })
  //     )
  //   }

  abstract fetchPack(url: string, options: RequestOptions): Promise<T | string | Blob>;
}
