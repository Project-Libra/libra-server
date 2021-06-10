import http from 'http';

export interface RouterResponse {
  status?: number
  contentType?: 'application/json'
  payload: string
}

export type Router = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<RouterResponse>;
