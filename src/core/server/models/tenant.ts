import { Db, Collection } from 'mongodb';
import { defaultsDeep } from 'lodash';
import dotize from 'dotize';
import uuid from 'uuid';
import { Omit } from 'talk-common/types';

function collection(db: Db): Collection<Tenant> {
    return db.collection<Tenant>('tenants');
}

export interface TenantResource {
    readonly tenant_id: string;
}

export interface Wordlist {
    banned: string[];
    suspect: string[];
}

export enum Moderation {
    PRE = 'PRE',
    POST = 'POST',
}

export interface Tenant {
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

export type CreateTenantInput = Omit<Tenant, 'id'>;

const defaults: CreateTenantInput = {
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
    input: Partial<CreateTenantInput>
): Promise<Readonly<Tenant>> {
    const tenant = defaultsDeep({ id: uuid.v4() }, input, defaults);

    await collection(db).insert(tenant);

    return tenant;
}

export async function retrieve(db: Db, id: string): Promise<Readonly<Tenant>> {
    return collection(db).findOne({ id });
}

export async function retrieveMany(
    db: Db,
    ids: string[]
): Promise<Readonly<Tenant>[]> {
    const cursor = await collection(db).find({
        id: {
            $in: ids,
        },
    });

    const tenants = await cursor.toArray();

    return ids.map(id => tenants.find(tenant => tenant.id === id));
}

export async function retrieveAll(db: Db): Promise<Readonly<Tenant>[]> {
    return collection(db)
        .find({})
        .toArray();
}

export async function update(
    db: Db,
    id: string,
    update: Partial<CreateTenantInput>
): Promise<Readonly<Tenant>> {
    // Get the tenant from the database.
    const result = await collection(db).findOneAndUpdate(
        { id },
        // Only update fields that have been updated.
        { $set: dotize(update) },
        // False to return the updated document instead of the original
        // document.
        { returnOriginal: false }
    );

    return result.value;
}
