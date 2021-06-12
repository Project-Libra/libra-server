import http from 'http';

export interface Config {
  HOST: string
  PORT: number
  CLIENT: {
    ID: number
    SECRET: string
  }
}

export interface RouterResponse {
  status?: number
  contentType?: 'application/json'
  payload: string
}

export type Router = (req: http.IncomingMessage, res: http.ServerResponse) => Promise<RouterResponse>;

export type FetchMethod = 'GET' | 'POST';
export type FetchHeader = Record<string, string | number>;

export interface FetchResponse<T> {
  statusCode: number
  body: T
}

export type OsuStatus = 'pending' | 'wip' | 'graveyard';

export interface OsuMods {}

export interface OsuStatistics {
  count_50: number
  count_100: number
  count_300: number
  count_geki: number
  count_katu: number
  count_miss: number
}

export interface OsuBeatmap {
  difficulty_rating: number
  id: number
  mode: 'mania'
  status: OsuStatus
  total_length: number
  user_id: number
  version: string
  accuracy: number
  ar: number
  beatmapset_id: number
  bpm: number
  convert: boolean
  count_circles: number
  count_sliders: number
  count_spinners: number
  cs: number
  deleted_at: null | string
  drain: number
  hit_length: number
  is_scoreable: false
  last_updated: string
  mode_int: 3
  passcount: number
  playcount: number
  ranked: -2 | -1 | 0
  url: string
  checksum: string
}

export interface OsuCovers {
  cover: string
  'cover@2x': string
  card: string
  'card@2x': string
  list: string
  'list@2x': string
  slimcover: string
  'slimcover@2x': string
}

export interface OsuBeatmapset {
  artist: string
  artist_unicode: string
  covers: OsuCovers
  creator: string
  favourite_count: number
  hype: null | number
  id: number
  nsfw: boolean
  play_count: number
  preview_url: string
  source: string
  status: OsuStatus
  title: string
  title_unicode: string
  user_id: number
  video: boolean
}

export interface OsuUser {
  avatar_url: string
  country_code: string
  default_group: string
  id: number
  is_active: boolean
  is_bot: boolean
  is_deleted: boolean
  is_online: boolean
  is_supporter: boolean
  last_visit: string
  pm_friends_only: boolean
  profile_colour: null | string
  username: string
}

export interface OsuScore {
  id: number
  user_id: number
  accuracy: number
  mods: OsuMods[]
  score: number
  max_combo: number
  perfect: boolean
  statistics: OsuStatistics
  rank: string
  created_at: string
  best_id: null
  pp: null
  mode: 'mania'
  mode_int: 3
  replay: boolean
  beatmap: OsuBeatmap
  beatmapset: OsuBeatmapset
  user: OsuUser
}
