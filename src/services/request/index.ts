import { HttpClient, type HttpClientOptions, HttpStatus, type RequestOptions } from '@nameless/http';

export class FetchClient extends HttpClient<'data', Service.RestfulResult> {
  constructor(
    readonly host: string,
    readonly httpClientOptions: HttpClientOptions = {}
  ) {
    super(host, httpClientOptions);
  }

  fetch(url: string, options: RequestOptions = {}) {
    return fetch(
      this.host + url + HttpClient.getParamsString(options),
      Object.assign(options ?? {}, {
        headers: this.getHeaders(options?.headers ?? new Headers())
      })
    );
  }

  async fetchPack(url: string, options: RequestOptions = {}): Promise<any> {
    try {
      const response = await this.fetch(url, options);
      const contentType = response.headers.get('Content-Type');
      if (!contentType || contentType.includes('application/json')) {
        return response.json() as Promise<Service.RestfulResult>;
      } else if (contentType.includes('text/plain')) {
        return response.text();
      }
      return response.blob(); // 二进制数据，如文件
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Exception',
        error
      };
    }
  }
}
