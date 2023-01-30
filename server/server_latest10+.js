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

//ejs
// const ejs = require("ejs");

//port
const PORT = 3001;
//app
const app = express();

// 1 route
app.get("/test", (req, res) => {
  res.json([{ id: 11, username: "Max" }]);
  // res.send("Hello World!");
});

// 2 route - use async await to display the data, if not the content will not be there
app.get("/", async (req, res, next) => {
  let fetchedData;
  let colorData;
  //fetch color and userList
  let makeApiCall = (url) => {
    return new Promise((res, rej) => {
      fetch(url)
        .then((response) => response.json())
        .then((data) => res(data));
    });
  };

  let multiApiCall = [
    makeApiCall("https://random-data-api.com/api/color/random_color"),
    makeApiCall("https://jsonplaceholder.typicode.com/users"),
  ];

  await Promise.all(multiApiCall).then((value) => {
    colorData = value[0];
    fetchedData = value[1];
  });

  fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
    let didError = false;
    const stream = renderToPipeableStream(
      <App fetchedData={fetchedData} name="TestFile" colorData={colorData} />,
      {
        // It runs when the shell (Non-Suspense parts of the React app) is ready
        onShellReady() {
          res.statusCode = didError ? 500 : 200;
          // res.setHeader("Content-type", "text/html");
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          //   res.write(htmlPre + '<div id="root">');
          //res.send(data);
          stream.pipe(res);
          // res.send(data);
          // res.write("</div>" + htmlPost);
          // Render page using renderFile method
        },
        // It will execute when everything is complete
        onAllReady() {
          //   res.write("</div>" + htmlPost);
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
