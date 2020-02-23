import React from "react";
import "./FaceRecognition.css";

const FaceRecognition = ({ box, imageUrl }) => {
  //ter varaias divs bounding-box, uma para cada elemento box do vetor (cada face)
  //console.log(typeof box, "FaceRecog", box, box.length);
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
          <div
            className="bounding-box"
            style={{
              top: box[0].topRow,
              right: box[0].rightCol,
              bottom: box[0].bottomRow,
              left: box[0].leftCol
            }}
          ></div>
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
