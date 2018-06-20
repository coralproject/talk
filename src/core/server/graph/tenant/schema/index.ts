import loadSchema from 'talk-server/graph/common/schema';
import resolvers from 'talk-server/graph/tenant/resolvers';

export default function getTenantSchema() {
    return loadSchema('tenant', resolvers);
}
