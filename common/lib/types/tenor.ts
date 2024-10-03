export interface MediaFormat {
  url: string;
  duration: number;
  dims: number[];
  size: number;
}

export interface SearchResult {
  id: string;
  title: string;
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: [];
  hasaudio: boolean;
  media_formats: {
    webm: MediaFormat;
    mp4: MediaFormat;
    nanowebm: MediaFormat;
    loopedmp4: MediaFormat;
    gifpreview: MediaFormat;
    tinygifpreview: MediaFormat;
    nanomp4: MediaFormat;
    nanogifpreview: MediaFormat;
    tinymp4: MediaFormat;
    gif: MediaFormat;
    webp: MediaFormat;
    mediumgif: MediaFormat;
    tinygif: MediaFormat;
    nanogif: MediaFormat;
    tinywebm: MediaFormat;
  };
}

export interface SearchPayload {
  results: SearchResult[];
  next: string;
}

export interface FetchPayload {
  results: SearchResult[];
}
