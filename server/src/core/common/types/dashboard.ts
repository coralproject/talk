export interface TodayMetricsJSON {
  users: {
    total: number;
    bans: number;
  };
  comments: {
    total: number;
    rejected: number;
    staff: number;
  };
}

export interface TimeSeriesMetricsJSON {
  series: Array<{ count: number; timestamp: string }>;
  average?: number;
}

export interface TodayStoriesMetricsJSON {
  results: Array<{
    count: number;
    story: {
      id: string;
      title?: string;
    };
  }>;
}
