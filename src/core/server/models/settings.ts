import { Db } from 'mongodb';
import { defaultsDeep } from 'lodash';
import dotize from 'dotize';

// selector is the single document selector for the Settings model stored in the
// settings collection in MongoDB.
const selector = { id: '1' };

export interface Wordlist {
    banned: string[];
    suspect: string[];
}

export enum Moderation {
    PRE = 'PRE',
    POST = 'POST',
}

export interface Settings {
    readonly id: string;

    moderation: Moderation;
    requireEmailConfirmation: boolean;
    infoBoxEnable: boolean;
    infoBoxContent?: string;
    questionBoxEnable: boolean;
    questionBoxIcon?: string;
    questionBoxContent?: string;
    premodLinksEnable: boolean;
    autoCloseStream: boolean;
    closedTimeout: number;
    closedMessage?: string;
    customCssUrl?: string;
    disableCommenting: boolean;
    disableCommentingMessage?: string;

    // editCommentWindowLength is the length of time (in milliseconds) after a
    // comment is posted that it can still be edited by the author.
    editCommentWindowLength: number;
    charCountEnable: boolean;
    charCount?: number;
    organizationName?: string;
    organizationContactEmail?: string;

    // wordlist stores all the banned/suspect words.
    wordlist: Wordlist;

    // domains is the set of whitelisted domains.
    domains: string[];
}

const defaultSettings: Settings = {
    // Include the selector.
    ...selector,

    // Default to post moderation.
    moderation: Moderation.POST,

    // Email confirmation is default off.
    requireEmailConfirmation: false,
    infoBoxEnable: false,
    questionBoxEnable: false,
    premodLinksEnable: false,
    autoCloseStream: false,
    // Two weeks timeout.
    closedTimeout: 60 * 60 * 24 * 7 * 2,
    disableCommenting: false,
    editCommentWindowLength: 30 * 1000,
    charCountEnable: false,
    wordlist: {
        suspect: [],
        banned: [],
    },
    domains: [],
};

export async function create(
    db: Db,
    settingsInput: Partial<Settings>
): Promise<Readonly<Settings>> {
    const result = await db
        .collection<Settings>('settings')
        .findOneAndReplace(
            selector,
            defaultsDeep({}, settingsInput, defaultSettings),
            {
                upsert: true,
                returnOriginal: false,
            }
        );

    return result.value;
}

export async function retrieve(db: Db): Promise<Readonly<Settings>> {
    const settings = await db
        .collection<Settings>('settings')
        .findOne(selector);
    if (!settings) {
        throw new Error('settings not initialized'); // FIXME: return actual typed error
    }

    return settings;
}

export async function update(
    db: Db,
    update: Partial<Settings>
): Promise<Readonly<Settings>> {
    // Get the settings from the database.
    const result = await db.collection<Settings>('settings').findOneAndUpdate(
        selector,
        // Only update fields that have been updated.
        { $set: dotize(update) },
        // False to return the updated document instead of the original
        // document.
        { returnOriginal: false }
    );

    return result.value;
}
