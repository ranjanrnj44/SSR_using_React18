//common component
//import CommonJs from "../src/Common";
//replaceString
//import replaceString from "replace-string";

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

app.use(express.static(__dirname));

// 1 route
app.get("/test", (req, res) => {
  res.json([{ id: 11, username: "Max" }]);
  // res.send("Hello World!");
});

//use async await to display the data, if not the content will not be there
app.get("/one", async (req, res, next) => {
  //fetch and send
  let fetchedData = [];
  await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data;
    });

  fs.readFile(path.resolve("./build/index.html"), "utf-8", (error, data) => {
    //data spliting and adding;
    //console.log(data.split(" "));
    let dataSplit = data.split(" ");
    let extractData = dataSplit[33].split("");
    extractData[10] = "<h2>Max</h2>"; //------> serving static data
    let injectedData = extractData.join("");
    dataSplit[33] = injectedData;

    console.log(dataSplit.toString());
    //log
    //console.log(res);

    let didError = false;
    const stream = renderToPipeableStream(
      <App fetchedData={fetchedData} name="TestFile" />,
      {
        onAllReady() {
          // If something errored before we started streaming, we set the error code appropriately.
          res.statusCode = didError ? 500 : 200;
          res.setHeader("Content-type", "text/html");
          //console.log(JSON.stringify(res));

          //
          //res.send(dataSplit.toString());
          //res.write(<div>{res}</div>);
          stream.pipe(res);
          //
        },
        onShellError(error) {
          // Something errored before we could complete the shell so we emit an alternative shell.
          res.statusCode = 500;
          console.error(error);
          res.send(
            '<!doctype html><p>Loading...</p><script src="clientrender.js"></script>'
          );
        },
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
