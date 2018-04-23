import { gql } from 'react-apollo';
import GlobalSwitchoff from '../components/GlobalSwitchoff';
import { withFragments } from 'plugin-api/beta/client/hocs';

export default withFragments({
  settings: gql`
    fragment TalkPlugin_GlobalSwitchoff_settings on Settings {
      globalSwitchoffEnable
      globalSwitchoffMessage
    }
  `,
})(GlobalSwitchoff);
