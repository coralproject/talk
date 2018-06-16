import Assets from './assets';
import Comments from './comments';
import Users from './users';
import Context from 'talk-server/graph/tenant/context';

export default (ctx: Context) => ({
    Assets: Assets(ctx),
    Comments: Comments(ctx),
    Users: Users(ctx),
});
