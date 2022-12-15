// FIXME: webpack.config.js의 loader규칙이 잘못되어 volume rendering이 bundle이 안되는 중인 듯. loader 작성법 알아본 뒤에 vtk.js 튜토리얼에서 확인해보기
// https://github.com/Kitware/vtk-js/issues/1003

const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/VolumeRendering.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "VolumeRendering_bundle.js",
  },
};
