export interface CommentsCount {
  count: number;
  byAuthorRole: {
    staff: {
      count: number;
    };
  };
}

export interface CommentsCountJSON {
  comments: CommentsCount;
}

export interface CommentsTodayJSON {
  comments: CommentsCount;
}

export interface SignupsJSON {
  signups: {
    count: number;
  };
}
export interface UserBanStatusJSON {
  users: {
    count: number;
    banned: {
      count: number;
    };
  };
}

export interface TopStoryJSON {
  comments: {
    count: number;
  };
  metadata?: {
    title?: string;
  };
  url?: string;
  id: string;
}

export interface DailyTopStoriesJSON {
  topStories: TopStoryJSON[];
}

export interface BansTodayJSON {
  banned: {
    count: number;
  };
}

export interface RejectedJSON {
  rejected: {
    count: number;
  };
}

export interface HourlyCommentsJSON {
  counts: {
    count: number;
    timestamp: string;
  }[];
  average: number;
}

export interface DailySignupsJSON {
  counts: {
    count: number;
    timestamp: string;
  }[];
}

export interface SignupsDailyJSON {
  signups: {
    days: {
      count: number;
      timestamp: string;
    }[];
  };
}

export interface DailyAverageCommentsJSON {
  comments: {
    average: number;
  };
}

export interface CountersJSON {
  counts: {
    comments: number;
    staffComments: number;
    rejections: number;
    signups: number;
    bans: number;
  };
}
