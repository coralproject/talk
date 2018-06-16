import { Db } from 'mongodb';
import { FilterQuery } from './types';
import { defaults } from 'lodash';
import uuid from 'uuid';
import { Omit } from 'talk-common/types';
import dotize from 'dotize';

export interface Asset {
    readonly id: string;
    url: string;
    scraped?: Date;
    closedAt?: Date;
    closedMessage?: string;
    title?: string;
    description?: string;
    image?: string;
    section?: string;
    subsection?: string;
    author?: string;
    publication_date?: Date;
    modified_date?: Date;
    created_at: Date;
}

export type CreateAssetInput = Pick<Asset, 'id' | 'url'>;

export async function create(db: Db, input: CreateAssetInput): Promise<Asset> {
    const now = new Date();

    // Construct the filter.
    const filter: FilterQuery<Asset> = {};
    if (input.id) {
        filter.id = input.id;
    } else {
        filter.url = input.url;
    }

    // Craft the update object.
    const update: { $setOnInsert: Asset } = {
        $setOnInsert: defaults(input, {
            id: uuid.v4(),
            created_at: now,
        }),
    };

    // Perform the upsert operation.
    const result = await db
        .collection<Asset>('assets')
        .findOneAndUpdate(filter, update, {
            // Create the object if it doesn't already exist.
            upsert: true,
            // False to return the updated document instead of the original
            // document.
            returnOriginal: false,
        });

    return result.value;
}

export async function exists(db: Db, id: string): Promise<boolean> {
    // TODO: implement
    // const cursor = await db.collection<Asset>('assets').find({ id }).limit(1);

    return null;
}

export async function retrieve(db: Db, id: string): Promise<Asset> {
    return await db.collection<Asset>('assets').findOne({ id });
}

export async function retrieveMany(
    db: Db,
    ids: string[]
): Promise<Array<Asset>> {
    const cursor = await db
        .collection<Asset>('assets')
        .find({ id: { $in: ids } });

    const assets = await cursor.toArray();

    return ids.map(id => assets.find(asset => asset.id === id));
}

export type UpdateAssetInput = Omit<
    Partial<Asset>,
    'id' | 'url' | 'created_at'
>;

export async function update(
    db: Db,
    id: string,
    update: UpdateAssetInput
): Promise<Readonly<Asset>> {
    const result = await db.collection<Asset>('assets').findOneAndUpdate(
        { id },
        // Only update fields that have been updated.
        { $set: dotize(update) },
        // False to return the updated document instead of the original
        // document.
        { returnOriginal: false }
    );

    return result.value;
}
