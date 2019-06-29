import axios from 'axios';

export class MoebooruApi {
  host:string   = ''
  http          = axios;

  constructor(host:string='') {
    this.host = host;
  }

  async post(param:IPostParams={limit: 15}, config={host:this.host}) {
    param = {
      limit: 30,
      page: 1,
      ...param
    }

    var res = this.http.get(`http://${config.host}/post.json`, {
      params: param
    })

    return res;
  }
}

export interface IPostParams {
  limit?:number,
  page?: number,
  tags?: string
}

export interface IPost {
  actual_preview_height: number,
  actual_preview_width: number,
  author: string,
  change: number,
  created_at: number,
  creator_id: number,
  file_size: number,
  file_url: string,
  frames: Array<any>,
  frames_pending: Array<any>,
  frames_pending_string: string,
  frames_string: string,
  has_children: boolean,
  height: number,
  id: number,
  is_held: boolean,
  is_shown_in_index: boolean,
  jpeg_file_size: number,
  jpeg_height: number,
  jpeg_url: string,
  jpeg_width: number,
  md5: string,
  parent_id: number,
  preview_height: number,
  preview_url: string,
  preview_width: number,
  rating: string,
  sample_file_size: number,
  sample_height: number,
  sample_url: string,
  sample_width: number,
  score: number,
  source: string,
  status: string,
  tags: string,
  width: number
}

export default new MoebooruApi();
