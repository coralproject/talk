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
    APPROVED: number;
    NONE: number;
    PREMOD: number;
    REJECTED: number;
    SYSTEM_WITHHELD: number;
    REPORTED: number;
  };
}
