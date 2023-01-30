import React, { Suspense, lazy } from "react";
//css
import "./App.css";
//loader-spinner
//import { ColorRing } from "react-loader-spinner";

//components
import ColorDetail from "./components/ColorDetail";
import MainContent from "./components/MainContent";
import NavBar from "./components/NavBar";
// import DelayedComponent from "./components/DelayedComponent";
const UserListFetch = lazy(() => import("./components/UserListFetch"));
//delayed function - to show everything is independently loading
const DelayedComponent = lazy(async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return await import("./components/DelayedComponent");
});
const UserListSSR = lazy(() => import("./components/UserListSSR.js"));

//spinner
// const spinners = (
//   <ColorRing
//     visible={true}
//     height="80"
//     width="80"
//     ariaLabel="blocks-loading"
//     wrapperStyle={{}}
//     wrapperClass="blocks-wrapper"
//     colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
//   />
// );

//app
export default function App(props) {
  const { name, fetchedData, colorData } = props;
  return (
    <div className="App">
      <NavBar name={name} />

      <div className="app-mid-container">
        <Suspense fallback={<h3 style={{ color: "red" }}>Loading.....</h3>}>
          <ColorDetail colorData={colorData} />
        </Suspense>

        <MainContent />

        <Suspense fallback={<h3 style={{ color: "red" }}>Loading.....</h3>}>
          <UserListFetch fetchedData={fetchedData} />
        </Suspense>

        <Suspense fallback={<h3 style={{ color: "red" }}>Loading.....</h3>}>
          <DelayedComponent />
        </Suspense>

        <Suspense fallback={<h3 style={{ color: "red" }}>Loading.....</h3>}>
          <UserListSSR fetchedData={fetchedData} />
        </Suspense>
      </div>
    </div>
  );
}
