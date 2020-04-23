export interface CommentsCount {
  count: number;
  byAuthorRole: {
    staff: {
      count: number;
    };
  };
}

export interface DailyCommentsJSON {
  comments: CommentsCount;
}

export interface HourlyCommentsJSON {
  comments: (CommentsCount & {
    hour: string;
  })[];
}

export interface DailySignupsJSON {
  signups: {
    count: number;
  };
}

export interface DailySignupsByWeekJSON {
  signups: [
    {
      count: number;
      date: string;
    }
  ];
}

export interface DailyNewCommentersJSON {
  newCommenters: {
    count: number;
  };
}

export interface HourlyNewCommentersJSON {
  newCommenters: {
    count: number;
    hour: string;
  }[];
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

export interface CommentStatusesJSON {
  commentStatuses: {
    public: number;
    rejected: number;
    witheld: number;
  };
}

export interface DailyBansJSON {
  banned: {
    count: number;
  };
}
