import React, { useState } from "react";

let UserListFetch = ({ fetchedData }) => {
  //state
  const [list, setList] = useState(fetchedData);
  //handleDelete
  const handleDelete = (userID) => {
    const remainingItems = list?.filter((item) => item.id !== userID);
    setList(remainingItems);
  };

  return (
    <>
      <h2>UserListFetch - Posts</h2>
      <ul>
        {list?.map((item) => (
          <li key={item.id}>
            <p>{item.username}</p>
            <button type="button" onClick={() => handleDelete(item.id)}>
              delete
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserListFetch;
