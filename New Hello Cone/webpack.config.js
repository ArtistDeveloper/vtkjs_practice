// FIXME: webpack.config.js의 loader규칙이 잘못되어 volume rendering이 bundle이 안되는 중인 듯. loader 작성법 알아본 뒤에 vtk.js 튜토리얼에서 확인해보기
// https://github.com/Kitware/vtk-js/issues/1003

const path = require("path");
var vtkRules = require("vtk.js/Utilities/config/dependency.js").webpack.core
  .rules;

// export const entry = "./source/index.js";
module.exports = {
  mode: "development",
  entry: "./src/VolumeRendering.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "VolumeRendering_bundle.js",
  },
  module: {
    rules: [].concat(vtkRules),
  },
};

// const path = require("path"); // node.js에서 파일의 경로를 핸들링하도록 도와주는 기능.

// // export const entry = "./source/index.js";
// module.exports = {
//   mode: "development",
//   entry: "./src/index.js",
//   output: {
//     path: path.resolve(__dirname, "dist"),
//     filename: "index_bundle.js",
//   },
// };
