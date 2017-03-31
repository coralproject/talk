const fs = require('fs');
const path = require('path');
const debug = require('debug')('talk:plugins');

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

  // The plugin is not available.
  return undefined;
}

/**
 * Stores a reference to a section for a section of Plugins.
 */
class PluginSection {
  constructor(plugin_names) {
    this.plugins = Object.keys(plugin_names).map((plugin_name) => {
      let plugin = {};

      // Get the version/folder that was specified.
      plugin.version = plugin_names[plugin_name];

      // Get the path for the plugin.
      plugin.path = pluginPath(plugin_name);

      if (typeof plugin.path === 'undefined') {
        throw new Error(`plugin '${plugin_name}' is not local or is not symlinked from your node_modules directory, plugin reconsiliation may be required`);
      }

      try {
        plugin.module = require(plugin.path);
      } catch (e) {
        throw new Error(`plugin '${plugin_name}' could not be required from '${plugin.path}': ${e.message}`);
      }

      if (isInternal(plugin_name)) {
        debug(`loading internal plugin '${plugin_name}' from '${plugin.path}'`);
      } else {
        debug(`loading external plugin '${plugin_name}' from '${plugin.path}'`);
      }

      // Ensure we have a default plugin name, but allow the name to be
      // overrided by the plugin.
      plugin.name = plugin.name || plugin_name;

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
      .map((plugin) => ({plugin, [hook]: module[hook]}));
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
  pluginPath
};
