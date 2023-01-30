import React, { useState } from "react";

function UserListSSR({ fetchedData }) {
  //state
  const [count, setCount] = useState(2);

  return (
    <>
      <h2>UserListSSR - Posts</h2>
      <ul>
        {fetchedData?.map((item) => (
          <li key={item.id}>{item.username}</li>
        ))}
      </ul>
      <h2>
        COUNT : <span className="count">{count}</span>
      </h2>
      <p>
        Libraries can prevent waterfalls by offering a more centralized way to
        do data fetching. For example, Relay solves this problem by moving the
        information about the data a component needs to statically analyzable
        fragments, which later get composed into a single query. On this page,
        we don’t assume knowledge of Relay, so we won’t be using it for this
        example. Instead, we’ll write something similar manually by combining
        our data fetching methods:
      </p>
      <p>
        Libraries can prevent waterfalls by offering a more centralized way to
        do data fetching. For example, Relay solves this problem by moving the
        information about the data a component needs to statically analyzable
        fragments, which later get composed into a single query. On this page,
        we don’t assume knowledge of Relay, so we won’t be using it for this
        example. Instead, we’ll write something similar manually by combining
        our data fetching methods:
      </p>
      <button
        className="button"
        type="button"
        onClick={() => setCount((prev) => prev + 1)}
      >
        increase
      </button>
    </>
  );
}

export default UserListSSR;
