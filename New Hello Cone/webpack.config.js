const path = require('path'); // node.js에서 파일의 경로를 핸들링하도록 도와주는 기능.

// export const entry = "./source/index.js";
module.exports = {
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname, "dist"),
        filename: 'index_bundle.js'
    }
}