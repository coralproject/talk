import {createDefaultResponseFragments} from '../utils';

// fragments defined here are automatically registered.
export default {
  ...createDefaultResponseFragments(
    'SetCommentStatusResponse',
    'SuspendUserResponse',
    'RejectUsernameResponse',
    'SetUserStatusResponse',
    'CreateFlagResponse',
    'EditCommentResponse',
    'PostFlagResponse',
    'CreateDontAgreeResponse',
    'DeleteActionResponse',
    'ModifyTagResponse',
    'IgnoreUserResponse',
    'StopIgnoringUserResponse',
  )
};

