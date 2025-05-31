const { getDefaultConfig } = require("@expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.sourceExts.push("cjs");
// This is the new line you should add in, after the previous lines
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
