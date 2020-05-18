import React from "react";
import { getImageInfos } from "../utils/firebaseUtil";
import HomeIcon from "@material-ui/icons/Home";
import Router from "next/router";

export default function Gallery(props: any) {
  const modalEl = React.useRef<HTMLDivElement>(null);
  const [imgURL, setImgURL] = React.useState<string>("");
  const [captionText, setCaptionText] = React.useState<string>("");

  const clickImg = (imageInfo: any) => {
    setImgURL(imageInfo.url);
    setCaptionText(imageInfo.detectedName);
    modalEl.current?.classList.add("displayBlock");
  };

  const clickClose = () => {
    modalEl.current?.classList.remove("displayBlock");
  };

  const showImg = (e: any) => {
    console.log(e.currentTarget.parentElement);
    e.currentTarget.parentElement?.classList.remove("displayNone");
    e.currentTarget.parentElement?.classList.add("displayBlock");
  };

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
          <div
            className="imageContainer displayNone"
            key={imageInfo.id}
            onClick={() => {
              clickImg(imageInfo);
            }}
          >
            <img
              src={imageInfo.url}
              alt=""
              onLoad={(e) => {
                showImg(e);
              }}
            />
            <div className="detectedName">{imageInfo.detectedName}</div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div className="modal" ref={modalEl}>
        {/* close */}
        <span className="close" onClick={clickClose}>
          &times;
        </span>

        <div className="modalImageContainer">
          {/* modal caption */}
          <div className="caption">{captionText}</div>

          {/* modal content */}
          <img className="modal-content" src={imgURL} />
        </div>
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
            transform: translate(0, 2px);
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
            opacity: 0;
            animation: opacity1 0.5s forwards;
          }

          @keyframes opacity1 {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
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

          /* The Modal (background) */
          .modal {
            display: none; /* Hidden by default */
            position: fixed; /* Stay in place */
            z-index: 1; /* Sit on top */
            padding-top: 100px; /* Location of the box */
            left: 0;
            top: 0;
            width: 100%; /* Full width */
            height: 100%; /* Full height */
            overflow: auto; /* Enable scroll if needed */
            background-color: rgb(0, 0, 0); /* Fallback color */
            background-color: rgba(0, 0, 0, 0.9); /* Black w/ opacity */
            z-index: 20;
          }

          .displayBlock {
            display: block;
          }

          .displayNone {
            display: none;
          }

          .modalImageContainer {
            transform: translate(0, -50px);
          }

          /* Modal Content (Image) */
          .modal-content {
            margin: auto;
            display: block;
            width: 80%;
            max-width: 700px;
          }

          /* Caption of Modal Image (Image Text) - Same Width as the Image */
          .caption {
            margin: auto;
            display: block;
            width: 80%;
            max-width: 700px;
            text-align: center;
            color: #ccc;
            padding: 10px 0;
            font-size: 30px;
          }

          /* Add Animation - Zoom in the Modal */
          .modal-content {
            animation-name: zoom;
            animation-duration: 0.6s;
          }

          @keyframes zoom {
            from {
              transform: scale(0);
            }
            to {
              transform: scale(1);
            }
          }

          /* The Close Button */
          .close {
            position: absolute;
            top: 15px;
            right: 35px;
            color: #f1f1f1;
            font-size: 40px;
            font-weight: bold;
            transition: 0.3s;
          }

          .close:hover,
          .close:focus {
            color: #bbb;
            text-decoration: none;
            cursor: pointer;
          }

          /* 100% Image Width on Smaller Screens */
          @media only screen and (max-width: 700px) {
            .modal-content {
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
}

Gallery.getInitialProps = async () => {
  const imageInfos = await getImageInfos();

  return { imageInfos };
};
