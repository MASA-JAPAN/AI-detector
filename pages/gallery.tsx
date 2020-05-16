import React from "react";
import { getImageInfos } from "../utils/firebaseUtil";
import HomeIcon from "@material-ui/icons/Home";
import Router from "next/router";

export default function Gallery(props: any) {
  // React.useEffect(() => {
  //   getImageInfos();
  // }, []);

  console.log(props.imageInfos);

  return (
    <div>
      <div className="appBar">
        <button
          className="homeButton"
          onClick={() =>
            Router.push({
              pathname: "/",
            })
          }
        >
          <HomeIcon fontSize="large" className="homeIcon" />
        </button>
        <div className="barTitle">Gallery</div>
      </div>
      <div className="imagesContainer">
        {props.imageInfos.map((imageInfo: any) => (
          <div className="imageContainer" key={imageInfo.id}>
            <img src={imageInfo.url} alt="" />
            <div className="detectedName">{imageInfo.detectedName}</div>
          </div>
        ))}
      </div>
      <style jsx>
        {`
          .appBar {
            position: fixed;
            width: 100vw;
            height: 100px;
            background: linear-gradient(
              180deg,
              #101010 -22.45%,
              rgba(196, 196, 196, 1) 485.71%
            );
            border: 1px solid #333333;
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            z-index: 10;
          }

          .barTitle {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: "Press Start 2P", cursive;
            font-style: normal;
            font-weight: 500;
            font-size: 50px;
            line-height: 28px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.1em;

            color: #ffffff;
          }

          .homeButton {
            position: absolute;
            padding: 15px 15px;
            left: 15px;
            top: 15px;

            color: white;

            background: linear-gradient(
              180deg,
              #0061f2 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );

            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          .homeButton:active {
            transform: translateY(2px);
          }

          .imagesContainer {
            /* Prevent vertical gaps */

            position: absolute;
            top: 110px;

            -webkit-column-count: 5;
            -webkit-column-gap: 0px;
            -moz-column-count: 5;
            -moz-column-gap: 0px;
            column-count: 5;
            column-gap: 0px;
          }

          .imageContainer {
            position: relative;
            margin: 10px 5px;
          }

          img {
            width: 100% !important;
            height: auto !important;
          }

          @media (max-width: 1200px) {
            .imagesContainer {
              -moz-column-count: 4;
              -webkit-column-count: 4;
              column-count: 4;
            }
          }
          @media (max-width: 1000px) {
            .imagesContainer {
              -moz-column-count: 3;
              -webkit-column-count: 3;
              column-count: 3;
            }
          }
          @media (max-width: 800px) {
            .imagesContainer {
              -moz-column-count: 2;
              -webkit-column-count: 2;
              column-count: 2;
            }
          }
          @media (max-width: 400px) {
            .imagesContainer {
              -moz-column-count: 1;
              -webkit-column-count: 1;
              column-count: 1;
            }
          }

          .detectedName {
            position: absolute;
            width: fit-content;
            top: 0;
            left: 0;
            font-size: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 0px 15px;
          }
        `}
      </style>
    </div>
  );
}

Gallery.getInitialProps = async () => {
  const imageInfos = await getImageInfos();
  console.log(imageInfos);

  return { imageInfos };
};
