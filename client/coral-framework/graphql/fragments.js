import { createDefaultResponseFragments } from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'SetUserRoleResponse',
    'ChangeUsernameResponse',
    'SetUsernameResponse',
    'BanUsersResponse',
    'UnbanUserResponse',
    'SetUserSuspensionStatusResponse',
    'SetCommentStatusResponse',
    'SetUsernameStatusResponse',
    'UnsuspendUserResponse',
    'SuspendUserResponse',
    'CreateCommentResponse',
    'CreateFlagResponse',
    'EditCommentResponse',
    'PostFlagResponse',
    'CreateDontAgreeResponse',
    'DeleteActionResponse',
    'ModifyTagResponse',
    'IgnoreUserResponse',
    'StopIgnoringUserResponse',
    'UpdateSettingsResponse',
    'UpdateAssetSettingsResponse',
    'UpdateAssetStatusResponse'
  ),
};
