import { createDefaultResponseFragments } from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'BanUsersResponse',
    'ChangeUsernameResponse',
    'CloseAssetResponse',
    'CreateCommentResponse',
    'CreateDontAgreeResponse',
    'CreateFlagResponse',
    'DeleteActionResponse',
    'EditCommentResponse',
    'IgnoreUserResponse',
    'ModifyTagResponse',
    'PostFlagResponse',
    'SetCommentStatusResponse',
    'SetUsernameResponse',
    'SetUsernameStatusResponse',
    'SetUserRoleResponse',
    'SetUserSuspensionStatusResponse',
    'StopIgnoringUserResponse',
    'SuspendUserResponse',
    'UnbanUserResponse',
    'UnsuspendUserResponse',
    'UpdateAssetSettingsResponse',
    'UpdateAssetStatusResponse',
    'UpdateSettingsResponse'
  ),
};
