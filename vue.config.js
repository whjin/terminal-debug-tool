const path = require("path");

module.exports = {
  publicPath: "./",
  lintOnSave: false,
  productionSourceMap: false,
  chainWebpack: config => {
    config.resolve.alias.set("@", path.join(__dirname, "src"));
    config.plugin("html").tap((args) => {
      args[0].title = "智能终端调试工具";
      return args;
    });
  }
};