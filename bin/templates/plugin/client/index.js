/**
  This is a client index example file and it could look like this:
  
  ```
  import LoveButton from './components/LoveButton';

  export default {
    slots: {
      commentReactions: [LoveButton]
    },
    reducer,
    translations
  };
  ```

  To read more info on how to build client plugins. Please, go to: https://docs.coralproject.net/talk/plugins-client
 */

import MyPluginComponent from './components/MyPluginComponent';

export default {
  slots: {
    stream: [MyPluginComponent],
  },
};
