//babel is required on SSR to support JSX
require("ignore-styles");

require("@babel/register")({
  ignore: [/(node_module)/],
  presets: ["@babel/preset-env", "@babel/preset-react"],
});

require("./server");
