import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";

const emitModulePackageFile = () => {
  return {
    name: "emit-module-package-file",
    generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: "package.json",
        source: `{"type":"module"}`
      });
    }
  };
};

export default {
  input: "./source/index.js",
  output: [
    {
      format: "umd",
      file: "dist/umd/js-search.js",
      name: "JsSearch"
    },
    {
      format: "umd",
      file: "dist/umd/js-search.min.js",
      name: "JsSearch",
      plugins: [terser()]
    },
    {
      format: "esm",
      file: "dist/esm/js-search.js",
      plugins: [emitModulePackageFile()]
    }
  ],
  plugins: [babel()]
};
