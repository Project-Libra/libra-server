import http from 'http';
import path from 'path';

import LeafDB from 'leaf-db';

import { Config, Router } from './types';
import { cron } from './utils';
import OsuApi from './api';

// Setup
const CONFIG: Config = process.env.NODE_ENV === 'development' ?
  require('../config/config.local') :
  require('../config/config');

const db = new LeafDB({
  name: 'scores',
  root: path.resolve(__dirname, '../db')
});

const api = new OsuApi({
  id: CONFIG.CLIENT.ID,
  secret: CONFIG.CLIENT.SECRET
});

// Init
