import React from "react";

function NavBar({ name }) {
  return (
    <div className="nav-wrapper">
      <div className="nav-heading">
        <h1>Navbar {name}</h1>
      </div>
      <ul className="nav-ulist">
        <li>Home</li>
        <li>About</li>
      </ul>
    </div>
  );
}

export default NavBar;
