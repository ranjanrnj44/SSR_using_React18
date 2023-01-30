import React, { useState } from "react";

let ColorDetail = ({ colorData }) => {
  const [color, setColor] = useState(colorData);

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h2>Color : {color?.color_name}</h2>
      <div
        style={{
          width: 50,
          height: 50,
          marginRight: 16,
          backgroundColor: color?.hex_value,
          borderRadius: 50,
        }}
      ></div>
    </div>
  );
};

export default ColorDetail;
