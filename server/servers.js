//express
import express from "express";

//to render react from our server side we need react, reactDOMServer and our app.js
import React from "react";
import { renderToString } from "react-dom/server";
import App from "../src/App";
//import { StaticRouter } from "react-router-dom/server";

//file sys and path
import fs from "fs";
import path from "path";

//this module is required to use fetch on the server
import fetch from "node-fetch-npm";

//port
const PORT = process.env.PORT || 3001;

//extracting files and spliting
//const html = fs.readFileSync("./build/index.html").toString(); // or utf8
const html = fs.readFileSync("./build/index.html").toString(); // or utf8

let splitHtml = html.split(" "); //split all html
let splitTexts = splitHtml[splitHtml.length - 1].split(""); //split the last array element

//const splitTexts = ["<div id='root'>", "</div>"];
//const [preHtml, postHtml] = html.split(splitTexts[0] + splitTexts[1]); //issue : preHTML taking whole content and postHtml is undefiend

//express app
const app = express();

//root route
app.use("/", async (req, res, next) => {
  //color
  let colorData = [];
  await fetch("https://random-data-api.com/api/color/random_color", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      colorData = data;
    });

  //fetch from external source and give into props
  let fetchedData = [];
  await fetch("https://jsonplaceholder.typicode.com/users", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      fetchedData = data;
    });

  const rcApp = (
    <App
      fetchedData={fetchedData}
      colorData={colorData}
      name="Testing SSR 18"
    />
    // <StaticRouter location={req.url}>
    //   <App fetchedData={fetchedData} colorData={colorData} name="Test SSR 18" />
    // </StaticRouter>
  );
  const markup = renderToString(rcApp);

  //add content
  splitTexts.splice(10, 0, `${markup}`);

  let joinRoot = splitTexts.join("");

  splitHtml[splitHtml.length - 1] = joinRoot;
  let moifiedContent = splitHtml.join(" ");
  console.log(moifiedContent);
  //console.log(splitHtml.join(" "));
  res.send(moifiedContent);
  res.end();
});

//server all the static files from build folder, provide path ..(1 leevel back)
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
