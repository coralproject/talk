export { default as withReaction } from './withReaction';
export { default as withTags } from './withTags';
export { default as withSortOption } from './withSortOption';
export {
  connect,
  withEmit,
  excludeIf,
  withFragments,
  withMutation,
  withForgotPassword,
  withSignIn,
  withSignUp,
  withResendEmailConfirmation,
  withSetUsername,
  withEnumValues,
  withVariables,
  withFetchMore,
  withSubscribeToMore,
  withRefetch,
  withGraphQLExtension,
} from 'coral-framework/hocs';
export {
  withIgnoreUser,
  withBanUser,
  withUnbanUser,
  withStopIgnoringUser,
  withSetCommentStatus,
  withChangePassword,
  withChangeUsername,
} from 'coral-framework/graphql/mutations';
export { compose } from 'recompose';
