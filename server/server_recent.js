import express from "express";
//file sys
import fs from "fs";
//path module
import path from "path";

//this module is required to use fetch
import fetch from "node-fetch-npm";

//to render react from our server side we need rct, rctDServer, app.js
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import App from "../src/App";
//npm fetch
//const fetch = require("node-fetch");

//port
const PORT = 3001;
//app
const app = express();

// 1 route
app.get("/test", (req, res) => {
  res.json([{ id: 11, username: "Max" }]);
});

// 2 route - use async await to display the data, if not the content will not be there
app.get("/one", async (req, res, next) => {
  //fetch color
  let colorData = [];
  await fetch("https://random-data-api.com/api/color/random_color", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      colorData = data;
    });

  //fetch userData
  let fetchedData = [];
  await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data;
    });

  //get the JS dynamic file by helper function -- working
  let matchedJsFiles;
  const jsFolder = "./build/static/js";
  const { readdir } = require("fs").promises;
  const findByNameJs = async (dir, name) => {
    matchedJsFiles = [];

    const files = await readdir(dir);

    for (const file of files) {
      if (file.startsWith(name) && file.endsWith("js")) {
        matchedJsFiles.push(file);
      }
    }
    return matchedJsFiles;
  };
  findByNameJs(jsFolder, "main").then((data) => {
    console.log(matchedJsFiles[0]);
  });

  //get the CSS dynamic file by helper function -- working
  let matchedCssFiles;
  const cssFolder = "./build/static/css";
  const findByNameCss = async (dir, name) => {
    matchedCssFiles = [];

    const files = await readdir(dir);

    for (const file of files) {
      if (file.startsWith(name) && file.endsWith("css")) {
        matchedCssFiles.push(file);
      }
    }
    return matchedCssFiles;
  };
  findByNameCss(cssFolder, "main").then((data) => {
    console.log(matchedCssFiles[0]);
  });

  fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
    //htmlOne
    let htmlPre = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Web site created using create-react-app"
        />
        <link rel="manifest" href="./manifest.json" />
        <script defer="defer" src="/static/js/${matchedJsFiles[0]}"></script>
        <link href="/static/css/${matchedCssFiles[0]}" rel="stylesheet" />
        <title>React App</title>
      </head>
      <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    `;
    let htmlPost = `
        </body>
      </html>
    `;

    let didError = false;
    const stream = renderToPipeableStream(
      <App fetchedData={fetchedData} name="TestFile" colorData={colorData} />,
      {
        // It runs when the shell (Non-Suspense parts of the React app) is ready
        onShellReady() {
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.write(htmlPre + '<div id="root">');
          stream.pipe(res);
        },

        // It will execute when everything is complete
        onAllReady() {
          res.write("</div>" + htmlPost);
        },

        // If the shell render resulted to error
        onError(x) {
          didError = true;
          console.error(`Something went wrong`, x);
        },
      }
    );
  });
});

//read our build's index html file
//server all the static files from build folder, provide path ..(1 leevel back)
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});
