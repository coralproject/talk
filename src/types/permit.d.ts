// TODO: (wyattjoh) following https://github.com/DefinitelyTyped/DefinitelyTyped/pull/29061 to merge then replace this with @types/permit.
declare module "permit" {
    import { IncomingMessage, ServerResponse } from "http";

    export interface PermitOptions {
        scheme?: string;
        proxy?: string;
        realm?: string;
    }

    export interface BearerOptions extends PermitOptions {
        basic?: string;
        header?: string;
        query?: string;
    }

    export class Permit {
        constructor(options: PermitOptions);
        check(req: IncomingMessage): void;
        fail(res: ServerResponse): void;
    }

    export class Bearer extends Permit {
        constructor(options: BearerOptions);
        check(req: IncomingMessage): string;
    }

    export class Basic extends Permit {
        check(req: IncomingMessage): [string, string];
    }
}