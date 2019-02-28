import { createDefaultResponseFragments } from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'AlwaysPremodUserResponse',
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
    'RemoveAlwaysPremodUserResponse',
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
    'UpdateSettingsResponse',
    'ChangePasswordResponse',
    'UpdateEmailAddressResponse',
    'AttachLocalAuthResponse'
  ),
};
