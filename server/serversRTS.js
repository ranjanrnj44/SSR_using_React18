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

  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    //const school = "gh";
    const htmlFile = ReactDOMServer.renderToString(
      <App
        fetchedData={fetchedData}
        colorData={colorData}
        name="Testing SSR 18"
      />
    );

    //if err on readin the data handle here
    if (err) {
      console.log(err);
      return res.status(500).send("Some error happened");
    }

    //if no error,get the data and replace the mounting point from react app's file
    let rootData = data.replace(
      '<div id="root"></div>',
      `<div id="root">${htmlFile}</div>` //passing app as string
    );

    return res.send(rootData);
  });
});

//server all the static files from build folder, provide path ..(1 leevel back)
app.use(express.static(path.resolve(__dirname, "..", "build")));

app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});
