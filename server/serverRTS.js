import express from "express";
//file sys
import fs from "fs";
//path module
import path from "path";

//this module is required to use fetch
import fetch from "node-fetch-npm";

//to render react from our server side we need rct, rctDServer, app.js
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../src/App";

//port
const PORT = 3001;
//app
const app = express();

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
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    //const school = "gh";
    const htmlFile = ReactDOMServer.renderToString(
      <App fetchedData={fetchedData} name="TestFile" />
    );

    //if err on readin the data handle here
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }

    //if no error,get the data and replace the mounting point from react app's file
    let replaceData = data.replace(
      '<div id="root"></div>',
      `<div id="root">${htmlFile}</div>` //passing app as string
    );

    return res.send(replaceData);
  });
});

// console.log(result);

//read our build's index html file

//server all the static files from build folder, provide path ..(1 leevel back)
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App launched on ${PORT}`);
});

// import express from “express”;import { renderToString } from “react-dom/server”;import { StaticRouter } from “react-router-dom/server”;import fs from “fs”;import App from “./src/App”;const PORT = process.env.PORT || 3001;const html = fs.readFileSync(“./build/index.html”).toString();const splitTexts = [“<div id=‘root’>”, “</div>”];const [preHtml, postHtml] = html.split(splitTexts[0]+ splitTexts[1]);const app = express();app.use(express.static(“./build”));app.use((req, res) => {const reactApp = (<StaticRouter url={location.url}><App /></StaticRouter>);const markup = renderToString(reactApp);res.send(`${preHtml}${splitTexts[0]}${markup}${splitTexts[1]}${postHtml}`);res.end();})app.listen(PORT, () => {console.log(`Listening on port ${PORT}`);});
