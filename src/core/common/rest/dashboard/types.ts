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
  hours: {
    count: number;
    timestamp: string;
  }[];
  byAuthorRole: {
    staff: {
      hours: {
        count: number;
        timestamp: string;
      }[];
    };
  };
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
