import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ box, imageUrl }) => {
  if (box.length > 0) {
    return (
      <div className="center ma">
        <div className="absolute mt2">
          <img
            id="inputimage"
            alt=""
            src={imageUrl}
            width="500px"
            height="auto"
          />
          {box.map(item => {
            return (
              <div
                key={box.topRow}
                className="bounding-box"
                style={{
                  top: item.topRow,
                  right: item.rightCol,
                  bottom: item.bottomRow,
                  left: item.leftCol
                }}
              ></div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="center ma">
        <div className="absolute mt2">
          <img
            id="inputimage"
            alt=""
            src={imageUrl}
            width="500px"
            height="auto"
          />
        </div>
      </div>
    );
  }
};

export default FaceRecognition;
