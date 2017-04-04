const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const debug = require('debug')('talk:plugins');

// Add support for require rewriting.
require('app-module-path').addPath(__dirname);

let plugins = {};

// Try to parse the plugins.json file, logging out an error if the plugins.json
// file isn't loaded, but continuing. Else, like a parsing error, throw it and
// crash the program.
try {
  plugins = JSON.parse(fs.readFileSync(path.join(__dirname, 'plugins.json'), 'utf8'));
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error('plugins.json not found, plugins will not be active');
  } else {
    throw err;
  }
}

/**
 * isInternal checks to see if a given plugin is internal, and returns true
 * if it is. 
 * 
 * @param {String} name 
 * @returns {Boolean}
 */
function isInternal(name) {
  const internalPluginPath = path.join(__dirname, 'plugins', name);

  // Check to see if this plugin exists internally, because if it doesn't, it is
  // external.
  return fs.existsSync(internalPluginPath);
}

/**
 * Returns the plugin path for the given plugin name.
 * 
 * @param {any} name 
 * @returns 
 */
function pluginPath(name) {
  if (isInternal(name)) {
    return path.join(__dirname, 'plugins', name);
  }

  try {
    return resolve.sync(name, {basedir: process.cwd()});
  } catch (e) {
    return undefined;
  }
}

function itteratePlugins(plugins) {
  return plugins.map((p) => {
    let plugin = {};

    // This checks to see if the structure for this entry is an object:
    // 
    // {"people": "^1.2.0"}
    // 
    // otherwise it's checked whether it matches the local version:
    //
    // "people"
    //
    if (typeof p === 'object') {
      plugin.name = Object.keys(p).find((name) => name !== null);
      plugin.version = p[plugin.name];
    } else if (typeof p === 'string') {
      plugin.name = p;
      plugin.version = `file:./plugins/${plugin.name}`;
    } else {
      throw new Error(`plugins.json is malformed, refer to PLUGINS.md for formatting, expected a string or an object for a plugin entry, found a ${typeof p}`);
    }

    // Get the path for the plugin.
    plugin.path = pluginPath(plugin.name);

    return plugin;
  });
}

/**
 * Stores a reference to a section for a section of Plugins.
 */
class PluginSection {
  constructor(plugins) {
    this.plugins = itteratePlugins(plugins).map((plugin) => {
      if (typeof plugin.path === 'undefined') {
        throw new Error(`plugin '${plugin.name}' is not local and is not resolvable, plugin reconsiliation may be required`);
      }

      try {
        plugin.module = require(plugin.path);
      } catch (e) {
        if (e && e.code && e.code === 'MODULE_NOT_FOUND' && isInternal(plugin.name)) {
          console.error(new Error(`plugin '${plugin.name}' could not be loaded due to missing dependencies, plugin reconsiliation may be required`));
          throw e;
        }

        console.error(new Error(`plugin '${plugin.name}' could not be required from '${plugin.path}': ${e.message}`));
        throw e;
      }

      if (isInternal(plugin.name)) {
        debug(`loading internal plugin '${plugin.name}' from '${plugin.path}'`);
      } else {
        debug(`loading external plugin '${plugin.name}' from '${plugin.path}'`);
      }

      return plugin;
    });
  }

  /**
   * This itterates over the section to provide all plugin hooks that are
   * available.
   */
  hook(hook) {
    return this.plugins
      .filter(({module}) => hook in module)
      .map((plugin) => ({
        plugin,
        [hook]: plugin.module[hook]
      }));
  }
}

const NullPluginSection = new PluginSection([]);

/**
 * Stores references to all the plugins available on the application.
 */
class PluginManager {
  constructor(plugins) {
    this.sections = {};

    for (let section in plugins) {
      this.sections[section] = new PluginSection(plugins[section]);
    }
  }

  /**
   * Utility function which combines the Plugins.section and PluginSection.hook
   * calls.
   */
  get(section, hook) {
    return this.section(section).hook(hook);
  }

  /**
   * Returns the named section if it exists, otherwise it returns an empty
   * plugin section.
   */
  section(section) {
    if (section in this.sections) {
      return this.sections[section];
    }

    return NullPluginSection;
  }
}

module.exports = {
  plugins,
  PluginManager,
  isInternal,
  pluginPath,
  itteratePlugins
};
