/* eslint-disable */
const withPlugins = require("next-compose-plugins")
const withImages = require("next-images")
const withSass = require("@zeit/next-sass")
const JsConfigPathsPlugin = require("jsconfig-paths-webpack-plugin")
/* eslint-enable */

module.exports = withPlugins([[withImages, withSass]], {
    webpack: (config) => {
        if (config.resolve.plugins) {
            // config.resolve.plugins.push(new JsConfigPathsPlugin({ configFile: "jsconfig.json" }))
        } else {
            // config.resolve.plugins = [new JsConfigPathsPlugin({ configFile: "jsconfig.json" })]
        }

        config.resolve.extensions.push(".js", ".jsx")
        return config
    }
})
