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

//port
const PORT = 3001;
//app
const app = express();

//app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static(path.join(__dirname)));

// 1 route
app.get("/test", (req, res) => {
  res.json([{ id: 11, username: "Max" }]);
  // res.send("Hello World!");
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

  fs.readFile(path.resolve("../build/index.html"), "utf-8", (error, data) => {
    //data
    //console.log(data.split(" "));

    //get files extension
    // const { readdir } = require("fs/promises");
    // const path = require("path");

    // const findByExtension = async (dir, ext) => {
    //   const matchedFiles = [];

    //   const files = await readdir(dir);

    //   for (const file of files) {
    //     // Method 1:
    //     const fileExt = path.extname(file);

    //     if (fileExt === `.${ext}`) {
    //       matchedFiles.push(file);
    //     }
    //   }

    //   return matchedFiles;
    // };
    // findByExtension("../src/components", "js").then((files) => {
    //   console.log(files);
    //});

    // const glob = require("glob");
    // glob("../build/static/js" + "/**/*.js", {}, (err, files) => {
    //   console.log(files);
    // });

    // const walkSync = require("walk-sync");
    // const files = walkSync("/static/js/", { globs: ["**/*.js"] });
    // console.log(files); //all html file path array

    // const testFolder = "../build/static/js/";
    // fs.readdir(testFolder, (err, files) => {
    //   files.find((item) => item.startsWith("main") && item.endsWith("js"));
    // });

    //get the file dynamic file by helper function
    // const testFolder = "../build/static/js/";
    // console.log(testFolder);
    // const { readdir } = require("fs").promises;
    // const findByName = async (dir, name) => {
    //   const matchedFiles = [];

    //   const files = await readdir(dir);

    //   for (const file of files) {
    //     if (file.startsWith(name) && file.endsWith("js")) {
    //       matchedFiles.push(file);
    //     }
    //   }
    //   return matchedFiles;
    // };
    // findByName(testFolder, "main").then((files) => {
    //   console.log(files);
    // });

    //get file by name - NOT WORKING
    // const { readdir } = require("fs").promises;
    // const findByName = async (dir, name) => {
    //   const matchedFiles = [];
    //   const files = await readdir(dir);
    //   for (const file of files) {
    //     const filename = path.parse(file).name;
    //     if (filename === name) {
    //       matchedFiles.push(file);
    //     }
    //   }
    //   return matchedFiles;
    // };
    // findByName("../build/static/js/", "index").then((files) => {
    //   console.log(files);
    // });

    //get the path
    // let jsFile = "/static/js/main.7b7162dd.js";
    // let cssFile = "/static/css/main.dcb7d3cf.css";
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
        <title>React App</title>
        <script defer="defer" src="/static/js/main.7b7162dd.js"></script>
    <link href="/static/css/main.dcb7d3cf.css" rel="stylesheet" />
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
          // res.setHeader("Content-type", "text/html");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.write(htmlPre + '<div id="root">');
          stream.pipe(res);
          // res.write("</div>" + htmlPost);
        },
        // It will execute when everything is complete
        onAllReady() {
          res.write("</div>" + htmlPost);
        },
        // If the shell render resulted to error
        onError(x) {
          didError = true;
          console.error(x);
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
