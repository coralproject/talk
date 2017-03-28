import React from 'react';
import injectedPlugins from 'coral-framework/helpers/importer';

export default function pluginContainer () {
  return (
    <div>
      {
        Object.keys(injectedPlugins).map((component, i) => {
          return injectedPlugins[component]({key: i});
        })
      }
    </div>
  );
}
