import http from 'http';
import path from 'path';

import LeafDB from 'leaf-db';

import { Config, OsuUser, OsuScore, Router } from './types';
import { cron, getBody } from './utils';
import OsuApi from './api';

// Setup
const CONFIG: Config = process.env.NODE_ENV === 'development' ?
  require('../config/config.local') :
  require('../config/config');

const db = {
  users: new LeafDB<OsuUser>({
    name: 'users',
    root: path.resolve(__dirname, '../db')
  }),
  scores: new LeafDB<OsuScore>({
    name: 'scores',
    root: path.resolve(__dirname, '../db')
  })
};

const api = new OsuApi({
  id: CONFIG.CLIENT.ID,
  secret: CONFIG.CLIENT.SECRET
});

// Server
const updateScores = async () => {
  const users = await db.users.find();
  const ids = users
    .filter(user => typeof user._id !== 'string')
    .map(user => user._id) as string[];
  const rawScores = await api.getScores(ids);
  const scores = rawScores.map(score => ({ _id: score.id, ...score }));
  await db.scores.insert(scores);
  db.scores.persist();
};

// Cron
cron(async () => {
  try {
    await updateScores();
  } catch (err) {
    console.error(err);
  }
});

// Router
const rootRouter: Router = async () => {
  const docs = await db.scores.find();

  return ({ payload: JSON.stringify(docs) });
};

const userRouter: Router = async (req, body) => {
  if (req.method !== 'POST') return ({ status: 404, payload: '404 (Not Found)' });
  const ids = await getBody<string[]>(req);
  const rawUsers = await Promise.all(ids.map(id => api.getUser(id)));
  const users = rawUsers
    .filter(user => user !== null)
    .map(user => user && ({ _id: user.id, ...user })) as OsuUser[];

  const newUsers = await db.users.insert(users.filter(user => user !== null) as OsuUser[]);
  db.users.persist();
  return ({ payload: JSON.stringify(newUsers) });
};

const routes: [string, Router][] = [
  ['/', rootRouter],
  ['/user', userRouter]
];

// Server
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
        console.error(err);

        res.writeHead(500);
        res.end();
      }
    } else {
      res.writeHead(404);
      res.end();
    }
  })
  .listen(CONFIG.PORT, CONFIG.HOST, () => {
    console.info(`Listening on: ${CONFIG.HOST}:${CONFIG.PORT}`);
  });

