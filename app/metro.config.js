const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

require("dotenv").config();

module.exports = config;
