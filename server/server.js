//express framework - (3rd party module) It's a layer built on the top of the Node js that helps manage servers and routes
import express from "express";
//file sys - CORE MODULE of NODEJS
import fs from "fs";
//path module - CORE MODULE of NODEJS
import path from "path";

//this module is required to use fetch - (3rd party module)
//import fetch from "node-fetch-npm";

//to render react from our server side we need rct, rctDServer, app.js
import React from "react";
import { renderToPipeableStream } from "react-dom/server"; // alpha stage, has some bugs
import App from "../src/App";

//port - .env is not created for now
const PORT = process.env.PORT || 3001;
//app
const app = express();

// 1 route - serve everything from here
app.get("/test", (req, res) => {
  res.json([{ id: 11, username: "Max" }]);
});

// 2 route - use async await to display the data, if not the content will not be there, it will load in advance
app.get("/one", async (req, res, next) => {
  // //fetch color
  // let colorData = [];
  // await fetch("https://random-data-api.com/api/color/random_color", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     colorData = data;
  //   });

  // //fetch userData
  // let fetchedData = [];
  // await fetch("https://jsonplaceholder.typicode.com/users", {
  //   method: "GET",
  //   headers: { "Content-Type": "application/json" },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     fetchedData = data;
  //   });

  //readFile

  //reading our build index.html file
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
    //reading our build index.html file, here we get our data incase err, we handle it separately
    //split and injecting the data
    const html = data.toString();
    const splitTexts = [`<div id="root">`, `</div>`];
    const [preHtml, postHtml] = html.split(splitTexts[0] + splitTexts[1]);
    //console.log(preHtml);
    //console.log(postHtml);

    let didError = false;
    const stream = renderToPipeableStream(
      <App name="SSR 18" />,
      // <App name="Test18" fetchedData={fetchedData} colorData={colorData} />,
      {
        // It runs when the content is ready
        onShellReady() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.write(`${preHtml}${splitTexts[0]}`).toString();
          stream.pipe(res);
        },

        // This will fire after the entire page content is ready.
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
//server all the static files from build folder, provide path .. - (1 leevel top)
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});
