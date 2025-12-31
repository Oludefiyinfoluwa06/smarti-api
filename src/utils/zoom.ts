import axios from 'axios';

const ZOOM_TOKEN = process.env.ZOOM_TOKEN; // OAuth access token or JWT token
const ZOOM_USER_ID = process.env.ZOOM_USER_ID; // email or userId for Zoom account

if (!ZOOM_TOKEN) {
  // don't throw at import time in environments where zoom is not configured, but log
  // callers should handle missing token and avoid calling the helper.
}

export type ZoomCreateMeetingResp = {
  id: number | string;
  join_url: string;
  start_url?: string;
  [k: string]: any;
};

export async function createInstantZoomMeeting(opts: { topic: string; duration?: number }) {
  if (!ZOOM_TOKEN) throw new Error('Missing ZOOM_TOKEN environment variable');
  if (!ZOOM_USER_ID) throw new Error('Missing ZOOM_USER_ID environment variable');

  const url = `https://api.zoom.us/v2/users/${encodeURIComponent(ZOOM_USER_ID)}/meetings`;

  const payload: any = {
    topic: opts.topic,
    type: 1, // instant meeting
    settings: {
      join_before_host: true,
      mute_upon_entry: true,
    },
  };

  if (opts.duration) payload.duration = Math.round(opts.duration);

  const resp = await axios.post(url, payload, {
    headers: {
      Authorization: `Bearer ${ZOOM_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  return resp.data as ZoomCreateMeetingResp;
}
