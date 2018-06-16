import DataLoader from 'dataloader';
import { User, retrieveMany } from 'talk-server/models/user';
import Context from 'talk-server/graph/tenant/context';

export default (ctx: Context) => ({
    user: new DataLoader<string, User>(ids =>
        retrieveMany(ctx.db, ctx.tenant.id, ids)
    ),
});
