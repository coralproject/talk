import {createDefaultResponseFragments} from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'ChangeUsernameResponse',
    'BanUsersResponse',
    'UnBanUserResponse',
    'SetUserSuspensionStatusResponse',
    'SetCommentStatusResponse',
    'SuspendUserResponse',
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
  )
};

