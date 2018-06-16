import { Db } from 'mongodb';
import { Redis } from 'ioredis';

import {
    Settings,
    retrieve as retrieveSettings,
} from 'talk-server/models/settings';

// Cache provides an interface for retrieving settings stored in local memory
// rather than grabbing it from the database every single call.
export default class Cache {
    private value: Promise<Readonly<Settings>>;

    constructor(db: Db, subscriber: Redis) {
        // Retrieve the settings from the database, and keep them cached in this
        // promise.
        this.value = retrieveSettings(db).then(settings => settings);

        // Subscribe to settings notifications.
        subscriber.subscribe('settings');

        // Attach to messages on this connection so we can receive updates when
        // the settings are changed.
        subscriber.on('message', this.onMessage);
    }

    /**
     *  onMessage is fired every time the client gets a subscription event.
     */
    private onMessage = async (channel: string, message: string) => {
        // Only do things when the message is for settings.
        if (channel !== 'settings') {
            return;
        }

        try {
            // Updated settings come from the messages.
            const settings: Settings = JSON.parse(message);

            // Update the settings cache.
            this.value = new Promise(resolve => resolve(settings));
        } catch (err) {
            // FIXME: handle the error
        }
    };

    /**
     * retrieve returns a promise that will resolve to the settings for Talk.
     */
    public async retrieve(): Promise<Readonly<Settings>> {
        return this.value;
    }

    /**
     * update will update the value for Settings in the local cache and publish
     * a change notification that will be used to keep the other nodes in sync.
     *
     * @param conn a redis connection used to publish the change notification
     * @param settings the updated Settings object
     */
    public async update(
        conn: Redis,
        settings: Settings
    ): Promise<Readonly<Settings>> {
        // Update the settings in the local cache.
        this.value = new Promise(resolve => resolve(settings));

        // Notify the other nodes about the settings change.
        await conn.publish('settings', JSON.stringify(settings));

        // Return the settings that were set.
        return settings;
    }
}
