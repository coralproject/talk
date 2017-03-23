import React from 'react';
import * as Plugins from 'plugins';

export default () => <div>{Object.keys(Plugins).map((component, i) => Plugins[component]({key: i}))}</div>;
