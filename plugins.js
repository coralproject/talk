const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const debug = require('debug')('talk:plugins');
const Joi = require('joi');
const amp = require('app-module-path');
const hjson = require('hjson');
const pkg = require('./package.json');

const PLUGINS_JSON = process.env.TALK_PLUGINS_JSON;

// Add the current path to the module root.
amp.addPath(__dirname);

let pluginsPath;
let plugins = {};

// Try to parse the plugins.json file, logging out an error if the plugins.json
// file isn't loaded, but continuing. Else, like a parsing error, throw it and
// crash the program.
try {
  let envPlugins = path.join(__dirname, 'plugins.env.js');
  let customPlugins = path.join(__dirname, 'plugins.json');
  let defaultPlugins = path.join(__dirname, 'plugins.default.json');

  if (PLUGINS_JSON && PLUGINS_JSON.length > 0) {
    debug('Now using TALK_PLUGINS_JSON environment variable for plugins');
    pluginsPath = envPlugins;
    plugins = require(pluginsPath);
  } else {
    if (fs.existsSync(customPlugins)) {
      debug(`Now using ${customPlugins} for plugins`);
      pluginsPath = customPlugins;
    } else {
      debug(`Now using ${defaultPlugins} for plugins`);
      pluginsPath = defaultPlugins;
    }

    // Load/parse the plugin content using hjson.
    const pluginContent = fs.readFileSync(pluginsPath, 'utf8');
    plugins = hjson.parse(pluginContent);
  }
} catch (err) {
  if (err.code === 'ENOENT') {
    console.error(
      'plugins.json and plugins.default.json not found, plugins will not be active'
    );
  } else {
    throw err;
  }
}

/**
 * All the hooks from plugins must match the schema defined here.
 */
const hookSchemas = {
  passport: Joi.func().arity(1),
  router: Joi.func().arity(1),
  context: Joi.object().pattern(/\w/, Joi.func().maxArity(1)),
  hooks: Joi.object().pattern(
    /\w/,
    Joi.object().pattern(
      /(?:__resolveType|\w+)/,
      Joi.object({
        pre: Joi.func(),
        post: Joi.func(),
      })
    )
  ),
  loaders: Joi.func().maxArity(1),
  mutators: Joi.func().maxArity(1),
  resolvers: Joi.object().pattern(
    /\w/,
    Joi.object().pattern(/(?:__resolveType|\w+)/, Joi.func())
  ),
  typeDefs: Joi.string(),
  schemaLevelResolveFunction: Joi.func(),
  websockets: Joi.object({
    onConnect: Joi.func(),
    onDisconnect: Joi.func(),
  }),
  connect: Joi.func().maxArity(1),
};

/**
 * PluginContext provides server context for the global application.
 */
class PluginContext {
  constructor() {
    this.pkg = pkg;
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
    try {
      return resolve.sync(name, {
        moduleDirectory: 'plugins',
        basedir: __dirname,
      });
    } catch (e) {
      console.warn(e);
      return undefined;
    }
  }

  try {
    return resolve.sync(name, { basedir: __dirname });
  } catch (e) {
    return undefined;
  }
}

class Plugin {
  constructor(entry) {
    // This checks to see if the structure for this entry is an object:
    //
    // {"people": "^1.2.0"}
    //
    // otherwise it's checked whether it matches the local version:
    //
    // "people"
    //
    if (typeof entry === 'object') {
      this.name = Object.keys(entry).find(name => name !== null);
      this.version = entry[this.name];
    } else if (typeof entry === 'string') {
      this.name = entry;
      this.version = `file:./plugins/${this.name}`;
    } else {
      throw new Error(
        `plugins.json is malformed, refer to PLUGINS.md for formatting, expected a string or an object for a plugin entry, found a ${typeof entry}`
      );
    }

    // Get the path for the plugin.
    this.path = pluginPath(this.name);
  }

  require() {
    if (typeof this.path === 'undefined') {
      throw new Error(
        `plugin '${
          this.name
        }' is not local and is not resolvable, plugin reconciliation may be required`
      );
    }

    try {
      this.module = require(this.path);
    } catch (e) {
      if (
        e &&
        e.code &&
        e.code === 'MODULE_NOT_FOUND' &&
        isInternal(this.name)
      ) {
        console.error(
          new Error(
            `plugin '${
              this.name
            }' could not be loaded due to missing dependencies, plugin reconciliation may be required`
          )
        );
        throw e;
      }

      console.error(
        new Error(
          `plugin '${this.name}' could not be required from '${this.path}': ${
            e.message
          }`
        )
      );
      throw e;
    }
  }
}

/**
 * Iterates over the plugins and gets the plugin path's, version, and name.
 *
 * @param {Array<Object|String>} plugins
 * @returns {Array<Object>}
 */
const iteratePlugins = plugins => plugins.map(p => new Plugin(p));

// Add each plugin folder to the allowed import path so that they can import our
// internal dependencies.
Object.keys(plugins).forEach(type =>
  iteratePlugins(plugins[type]).forEach(plugin => {
    // The plugin may be remote, and therefore not installed. We check here if the
    // plugin path is available before trying to monkey patch it's require path.
    if (plugin.path) {
      amp.enableForDir(path.dirname(plugin.path));
    }
  })
);

/**
 * Stores a reference to a section for a section of Plugins.
 */
class PluginSection {
  constructor(context, plugins) {
    this.context = context;
    this.required = false;
    this.plugins = iteratePlugins(plugins);
  }

  require() {
    if (this.required) {
      return;
    }

    this.required = true;
    this.plugins.forEach(plugin => {
      // Load the plugin.
      plugin.require();

      if (isInternal(plugin.name)) {
        debug(`loading internal plugin '${plugin.name}' from '${plugin.path}'`);
      } else {
        debug(`loading external plugin '${plugin.name}' from '${plugin.path}'`);
      }

      return plugin;
    });
  }

  /**
   * This iterates over the section to provide all plugin hooks that are
   * available.
   */
  hook(hookName) {
    // Load the plugin source if we haven't already.
    this.require();

    return this.plugins
      .filter(({ module }) => hookName in module)
      .map(plugin => {
        // Optionally bind the plugin context to a function if it's one.
        const hook =
          typeof plugin.module[hookName] === 'function'
            ? plugin.module[hookName].bind(this.context)
            : plugin.module[hookName];

        // Validate the hook.
        if (hookName in hookSchemas) {
          Joi.assert(
            hook,
            hookSchemas[hookName],
            `Plugin '${
              plugin.name
            }' failed validation for the '${hookName}' hook`
          );
        }

        return {
          plugin,
          [hookName]: hook,
        };
      });
  }
}

const NullPluginSection = new PluginSection({}, []);

/**
 * Stores references to all the plugins available on the application.
 */
class PluginManager {
  constructor(plugins) {
    this.context = new PluginContext();
    this.sections = {};

    for (let section in plugins) {
      this.sections[section] = new PluginSection(
        this.context,
        plugins[section]
      );
    }

    this.deferredHooks = [];
    this.ranDeferredHooks = false;
  }

  /**
   * Utility function which combines the Plugins.section and PluginSection.hook
   * calls.
   */
  get(sectionName, hookName) {
    return this.section(sectionName).hook(hookName);
  }

  /**
   * Utility function which combines the Plugins.section and PluginSection.hook
   * calls and runs them when the `runDeferred` is called.
   */
  defer(sectionName, hookName, callback) {
    const plugins = this.section(sectionName).hook(hookName);

    // If we've already ran the callbacks, then we should run it immediately.
    if (this.ranDeferredHooks) {
      plugins.forEach(callback);
    } else {
      this.deferredHooks.push({ plugins, callback });
    }
  }

  /**
   * Calls all deferred hooks.
   */
  runDeferred() {
    this.deferredHooks.forEach(({ plugins, callback }) =>
      plugins.forEach(callback)
    );
    this.ranDeferredHooks = true;
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
  pluginsPath,
  PluginManager,
  isInternal,
  pluginPath,
  iteratePlugins,
};
