import Asset from './asset';
import Context from 'talk-server/graph/context';

export default (ctx: Context) => ({ Asset: Asset(ctx) });
