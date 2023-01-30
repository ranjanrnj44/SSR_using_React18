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

  //readFile
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
    //split and inject the data
    const html = data.toString();
    const splitTexts = [`<div id="root">`, `</div>`];
    const [preHtml, postHtml] = html.split(splitTexts[0] + splitTexts[1]);

    let didError = false;
    const stream = renderToPipeableStream(
      <App fetchedData={fetchedData} name="TestFile" colorData={colorData} />,
      {
        // It runs when the shell (Non-Suspense parts of the React app) is ready
        onShellReady() {
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.write(`${preHtml}${splitTexts[0]}`).toString();
          stream.pipe(res);
        },

        // It will execute when everything is complete
        onAllReady() {
          res.write(`${splitTexts[1]}${postHtml}`).toString();
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
