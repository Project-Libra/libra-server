import https from 'https';

import { FetchMethod, FetchHeader, FetchResponse } from './types';

interface Fetch {
  url: string
  method: FetchMethod
  token?: string
  headers?: FetchHeader
  payload?: string
}

export const fetch = <T>(options: Fetch) => new Promise<FetchResponse<T>>((resolve, reject) => {
  const chunks: Buffer[] = [];
  const url = options.url.split('/');
  const req = https.request({
    host: url[0],
    path: `/${url.slice(1).join('/')}`,
    method: options.method,
    headers: {
      ...(options.headers || {}),
      Authorization: options.token ?
        `Bearer ${options.token}` :
        '',
    },
  }, res => {
    res.on('data', (chunk: Buffer) => chunks.push(chunk));
    res.on('error', reject);
    res.on('end', () => {
      if (!res.statusCode) {
        reject(new Error('Connection timed out'));
      } else {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(Buffer.concat(chunks).toString())
        });
      }
    });
  });

  req.on('error', reject);
  if (options.payload) req.write(options.payload);
  req.end();
});

export const post = <T>(url: string, payload: string, token?: string) => fetch<T>({
  url,
  method: 'POST',
  token,
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  },
  payload
});

export const get = <T>(url: string, params: Record<string, string | number | string[] | number[]>, token?: string) => fetch<T>({
  url: `${url}${Object.entries(params).reduce((acc, cur) => `${acc}&${cur[0]}=${cur[1]}`, '?')}`,
  method: 'GET',
  token
});
