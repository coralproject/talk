declare module "akismet-api" {
    export interface ClientOptions {
        key: string;
        blog: string;
    }

    export interface CheckSpamOptions {
        user_ip: string;
        user_agent: string;
        referrer: string;
        permalink?: string;
        comment_type?: string;
        comment_author?: string;
        comment_content?: string;
        comment_author_url?: string;
        comment_author_email?: string;
        comment_date_gmt?: string;
        comment_post_modified_gmt?: string;
        user_role?: string;
        is_test?: boolean;
    }

    export class Client {
        constructor(options: ClientOptions)

        /**
         * checkSpam will check the given comment payload for spam.
         * 
         * @param options used to provide the input for checking spam
         */
        checkSpam(options: CheckSpamOptions): Promise<boolean>
    }
}