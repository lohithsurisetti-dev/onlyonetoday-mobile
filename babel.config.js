module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // Removed reanimated plugin - using RN Animated API instead
  };
};

