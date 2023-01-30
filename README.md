# ServerSideRendering using React18 Features

Required Tools:

1. Any prefered IDE , nodejs installed, Chrome browser

# Some pre-requisite topics

1. Express : (Implemented Routings)
2. Nodejs : (Read/Write file using FileSystem, Streams)

# Objective

Usually the website's initial page will take some time to load that is developed using CSR approach. For lower-end device with slow network connection it will drastically decrease the website performance. In this scenario we can increase the performance of the page using certain techniques like SSR,SSG,ISG.

Performance optimisation - certain part of the page's load time can be increased using React18's new feature(renderToPipebleStream). At initial load users, instead of seeing blank page they can see the actual layout with pre-fetched contents.

# How to setup and Run the Project

To obtain SSR, we need to create react script to build client side scripts

1. server.js
   - server.js has our logic where we read our build's idnex.html
   - We read the data(index.html) and make some manipulations and inject the SSR content
   - Certain conditions are made to send contents once we received entire chunks
   - Finally we are serving the file from build

CREATING BUILD DIR WITH FILES and STARTING THE PROJECT:

- npm run build
- npm run ssr

NOTE : I have provided 2 routes (/test , /one) please use the path

# Any Blocker/Got Stuck?, Remember this points to check

1. Hydration issue - Remember, our SSR(build/index.html) and CSR(public/index.html) file should match with same data, if not we will get error reporting.
2. Avoid random data (i.e Date, random number login) on the server side.
3. Don't use renderToString(it does not support streaming, lazy loading). It comes with less supported use only.
4. As a static content for now, always pass the same props on App.js, Will get hydration error if got mismatched.
5. Use Async/Await for any data fetching logic if not then, the response will be sent earlier with no data that cause our app crash.

# Reference

SSR DOCS :

1. Understanding React 18 Architecture :
   https://blog.saeloun.com/2022/01/20/new-suspense-ssr-architecture-in-react-18
   https://github.com/reactwg/react-18/discussions/37
   https://blog.saeloun.com/2021/12/16/hydration
   https://reactjs.org/docs/react-dom-server.html#rendertopipeablestream
2. CSR vs SSR :
   https://ts.accenture.com/:w:/s/InnovationTeam187/EdnNHs7ji_FAvzL1JxYSIg4BAqEaEMI3dq8XW0-LcSh1LQ?e=zwbTQA
3. Upgrading R18 on server :
   https://github.com/reactwg/react-18/discussions/22

SSR VIDEO :

1. Streaming Server Rendering with Suspense : https://www.youtube.com/watch?v=pj5N-Khihgc
2. React 18 Features : https://www.youtube.com/watch?v=Z-NCLePa2x8&t=1s

OTHER REFERENCE

1. Suspense (for data fetching - EXPERIMENTAL) :
   https://dev.to/darkmavis1980/a-practical-example-of-suspense-in-react-18-3lln
