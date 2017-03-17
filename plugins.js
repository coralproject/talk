const fs = require('fs');
const path = require('path');

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
 * Stores a reference to a section for a section of Plugins.
 */
class PluginSection {
  constructor(plugin_names) {
    this.plugins = plugin_names.map((plugin_name) => {
      let plugin = require(`./plugins/${plugin_name}`);

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
      .filter((plugin) => hook in plugin)
      .map((plugin) => ({plugin, [hook]: plugin[hook]}));
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

module.exports = new PluginManager(plugins);
