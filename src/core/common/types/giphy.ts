export interface GiphyGifImage {
  url: string;
  width: string;
  height: string;
}

export interface GiphyGifOrignalImage {
  url: string;
  width: string;
  height: string;
  mp4: string;
  still: string;
}

export interface GiphyGifImages {
  original: GiphyGifOrignalImage;
  fixed_height_downsampled: GiphyGifImage;
  original_still: GiphyGifImage;
}

export interface GiphyGif {
  id: string;
  url: string;
  rating: string;
  title: string;
  images: GiphyGifImages;
}

export interface GiphyPagination {
  offset: number;
  total_count: number;
  count: number;
}

export interface GiphyGifSearchResponse {
  data: GiphyGif[];
  pagination: GiphyPagination;
}

export interface GiphyGifRetrieveResponse {
  data: GiphyGif;
}
