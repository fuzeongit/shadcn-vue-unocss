import { stringify } from 'qs';
import { SelectOptions } from '@/constants/dictionary/select-options';
import { dictionaryToOption } from '@/components/imanum/form';
import { FetchClient } from './request';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';

export async function fetchMock(params: any): Promise<Mock.RestfulResult<Mock.Pagination<Mock.UserAccount>>> {
  const res = await fetch(`https://mock.apifox.cn/m1/3109515-0-default/systemManage/getRoleList?${stringify(params)}`, {
    method: 'GET',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      apifoxtoken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2',
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJ1c2VyTmFtZSI6IlNveWJlYW4ifV0sImlhdCI6MTY5ODQ4NDg2MywiZXhwIjoxNzMwMDQ0Nzk5LCJhdWQiOiJzb3liZWFuLWFkbWluIiwiaXNzIjoiU295YmVhbiIsInN1YiI6IlNveWJlYW4ifQ._w5wmPm6HVJc5fzkSrd_j-92d5PBRzWUfnrTF1bAmfk',
      'if-none-match': 'W/"93b-jLWvSR61eeB2JCs9o8QHjW5Y6Cc"',
      origin: 'https://soybeanjs.cn',
      priority: 'u=1, i',
      referer: 'https://soybeanjs.cn/',
      'sec-ch-ua': '"Microsoft Edge";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
      'x-request-id': 'D2mgtaYgRf-T9G7eUsed_'
    }
  });
  return (await res.json()) as Mock.RestfulResult<Mock.Pagination<Mock.UserAccount>>;
}

export async function fetchMock2(value?: string): Promise<Imanum.Form.SelectOption[]> {
  return new Promise(resolve => {
    const list = dictionaryToOption(SelectOptions);
    resolve(value ? list.filter(it => it.label.includes(value)) : list);
  });
}

export const fetchClient = new FetchClient(
  isHttpProxy ? import.meta.env.VITE_SERVICE_BASE_PROXY : import.meta.env.VITE_SERVICE_BASE_URL
);
