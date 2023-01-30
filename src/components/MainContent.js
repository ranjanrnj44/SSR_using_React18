import React, { useState } from "react";

function MainContent() {
  //count
  const [count, setCount] = useState(5);
  return (
    <div className="mainContent">
      <h2>
        Main Content, COUNT : <span className="count">{count}</span>
      </h2>
      <button
        className="button"
        type="button"
        onClick={() => setCount((prev) => prev + 1)}
      >
        count++
      </button>
      <p>
        Libraries can prevent waterfalls by offering a more centralized way to
        do data fetching. For example, Relay solves this problem by moving the
        information about the data a component needs to statically analyzable
        fragments, which later get composed into a single query. On this page,
        we don’t assume knowledge of Relay, so we won’t be using it for this
        example. Instead, we’ll write something similar manually by combining
        our data fetching methods:
      </p>
    </div>
  );
}

export default MainContent;
