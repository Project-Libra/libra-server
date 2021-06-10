import http from 'http';
import path from 'path';

import LeafDB from 'leaf-db';

import { Router } from './types';

const HOST = process.argv[2] === 'dev' ? 'localhost' : '0.0.0.0';
const PORT = parseInt(process.env.PORT || '7777', 10);

const db = new LeafDB({
  name: 'scores',
  root: path.resolve(__dirname, '../db')
});

const rootRouter: Router = async () => {
  const docs = await db.find();

  return ({ payload: JSON.stringify(docs) });
};

const routes: [string, Router][] = [
  ['/', rootRouter],
];

http
  .createServer(async (req, res) => {
    const router = routes.find(route => route[0] === req.url);

    if (router) {
      try {
        const response = await router[1](req, res);

        res.setHeader('Content-Type', response.contentType || 'application/json');
        res.writeHead(response.status || 200);
        res.end(response.payload);
      } catch (err) {
        res.writeHead(500);
        res.end();
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(PORT, HOST, () => {
    console.info(`Listening on: ${HOST}:${PORT}`);
  });
