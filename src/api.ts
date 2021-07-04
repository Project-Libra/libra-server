import { get, post } from './fetch';
import { Score, OsuScore } from './types';
import { sleep } from './utils';

interface OAuth {
  token_type: string
  expires_in: number
  access_token: string
}

export default class OsuApi {
  private id: number;
  private secret: string;

  constructor(options: { id: number, secret: string }) {
    this.id = options.id;
    this.secret = options.secret;
  }

  private async getOauthToken() {
    try {
      const response = await post<OAuth>('osu.ppy.sh/oauth/token', JSON.stringify({
        grant_type: 'client_credentials',
        client_id: this.id,
        client_secret: this.secret,
        scope: 'public'
      }));

      if (response.statusCode !== 200) throw new Error(JSON.stringify(response.body));
      return response.body.access_token;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  private async getUserRecentScores(id: string, token: string) {
    try {
      const response = await get<OsuScore[]>(
        `osu.ppy.sh/api/v2/users/${id}/scores/recent`,
        { mode: 'mania', limit: 20 },
        token
      );

      if (response.statusCode !== 200) throw new Error(JSON.stringify(response.body));

      const data: Score[] = response.body.map(score => ({
        _id: `${score.id}`,
        user_id: score.user_id,
        accuracy: score.accuracy,
        mods: score.mods,
        score: score.score,
        max_combo: score.max_combo,
        created_at: score.created_at,
        beatmap_id: score.beatmap.id,
        beatmapset_id: score.beatmap.beatmapset_id
      }));

      return data;
    } catch (err) {
      console.error(err);

      return [];
    }
  }

  // async getUser(id: string) {
  //   try {
  //     const token = await this.getOauthToken();

  //     if (!token) throw new Error('Unable to retreive OAuth token');

  //     const response = await get<OsuUser>(
  //       `osu.ppy.sh/api/v2/users/${id}/mania`,
  //       {},
  //       token
  //     );

  //     if (response.statusCode !== 200) throw new Error(JSON.stringify(response.body));
  //     return response.body;
  //   } catch (err) {
  //     console.error(err);

  //     return null;
  //   }
  // }

  async getScores(users: string[], timeout = 20) {
    try {
      const token = await this.getOauthToken();

      if (!token) throw new Error('Unable to retreive OAuth token');

      const scores: Score[][] = [];
      for (let i = 0; i < users.length; i += 1) {
        const recentScores = await this.getUserRecentScores(users[i], token);
        scores.push(recentScores);
        await sleep(timeout);
      }

      return scores.flat();
    } catch (err) {
      console.error(err);

      return [];
    }
  }
}
