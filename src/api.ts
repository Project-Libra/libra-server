import { get, post } from './fetch';
import { OsuScore } from './types';

interface OAuth {
  token_type: string
  expires_in: number
  access_token: string
}

export const getOauthToken = (client_id: number, client_secret: string) => post<OAuth>('osu.ppy.sh/oauth/token', JSON.stringify({
  grant_type: 'client_credentials',
  client_id,
  client_secret,
  scope: 'public'
}));

export const getUserRecentScores = (id: number, token: string) => get<OsuScore[]>(
  `osu.ppy.sh/api/v2/users/${id}/scores/recent`,
  { mode: 'mania', limit: 20 }
);
