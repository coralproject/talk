import { Db } from 'mongodb';
import { Omit, Sub } from 'talk-common/types';
import { merge } from 'lodash';
import uuid from 'uuid';

export interface BodyHistoryItem {
    body: string;
    created_at: Date;
}

export interface StatusHistoryItem {
    status: CommentStatus; // TODO: migrate field
    assigned_by?: string;
    created_at: Date;
}

export enum CommentStatus {
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    PREMOD = 'PREMOD',
    SYSTEM_WITHHELD = 'SYSTEM_WITHHELD',
    NONE = 'NONE',
}

export interface ActionCounts {
    [_: string]: number;
}

export interface Comment {
    readonly id: string;
    parent_id?: string;
    author_id: string;
    asset_id: string;
    body: string;
    body_history: BodyHistoryItem[];
    status: CommentStatus;
    status_history: StatusHistoryItem[];
    action_counts: ActionCounts;
    reply_count: number;
    created_at: Date;
    deleted_at?: Date;
}

export type CreateCommentInput = Omit<
    Comment,
    'id' | 'created_at' | 'reply_count' | 'body_history' | 'status_history'
>;

export async function create(
    db: Db,
    input: CreateCommentInput
): Promise<Readonly<Comment>> {
    const now = new Date();

    // Pull out some useful properties from the input.
    const { body, status } = input;

    // default are the properties set by the application when a new comment is
    // created.
    const defaults: Sub<Comment, CreateCommentInput> = {
        id: uuid.v4(),
        created_at: now,
        reply_count: 0,
        body_history: [
            {
                body,
                created_at: now,
            },
        ],
        status_history: [
            {
                status,
                created_at: now,
            },
        ],
    };

    // Merge the defaults and the input together.
    const comment: Comment = merge({}, defaults, input);

    // TODO: Check for existence of the parent ID before we create the comment.

    // TODO: Check for existence of the asset ID before we create the comment.

    // Insert it into the database.
    await db.collection<Comment>('comments').insertOne(comment);

    // TODO: update reply count of parent if exists.

    return comment;
}

async function incrementReplyCount(db: Db, parentID: string): Promise<void> {
    return null;
}

export async function retrieve(db: Db, id: string): Promise<Comment> {
    return null;
}
