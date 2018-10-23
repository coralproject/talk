import createTopLevel, { CreateParams } from "../create";

export default function create(params: CreateParams) {
  return createTopLevel({
    ...params,
    initLocalState: (localRecord, source, environment) => {
      if (params.initLocalState) {
        localRecord.setValue("COMMENTS", "activeTab");
        localRecord.setValue("CREATED_AT_DESC", "defaultStreamOrderBy");
        params.initLocalState(localRecord, source, environment);
      }
    },
  });
}
