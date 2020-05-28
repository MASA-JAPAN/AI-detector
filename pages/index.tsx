import React from "react";
import Router from "next/router";

export default function IndexPage() {
  return (
    <div>
      <div className="container">
        <img src="/videos/top.gif" alt="" className="topGif" />
        <div className="title">WIT</div>
        <div className="description">What is this?</div>

        <div className="buttonContainer">
          <button
            className="startButton"
            onClick={() =>
              Router.push({
                pathname: "/detect",
              })
            }
          >
            Start
          </button>
          <button
            className="galleryButton"
            onClick={() =>
              Router.push({
                pathname: "/gallery",
              })
            }
          >
            Gallery
          </button>
        </div>
      </div>

      <style jsx>
        {`
          .container {
            position: relative;
            overflow: hidden;
            width: 100vw;
            height: 100vh;
          }
          .topGif {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            min-width: 100vw;
            min-height: 100vh;
          }

          .title {
            position: absolute;
            width: 278px;
            height: 96px;
            left: calc(50% - 278px / 2 + 5.5px);
            top: calc(50% - 96px / 2 - 130.5px);

            font-family: "Press Start 2P", cursive;
            font-style: normal;
            font-weight: normal;
            font-size: 80px;
            line-height: 80px;
            display: flex;
            align-items: center;
            text-align: center;
            letter-spacing: 0.215em;

            color: #000000;
            text-shadow: rgb(232, 60, 60) 1px 0 10px;
            animation: beatShadow 1.5s ease-in-out infinite both;
          }

          @keyframes beatShadow {
            0%,
            100% {
              text-shadow: rgb(232, 60, 60) 1px 0 10px;
              transform-origin: center center;
              animation-timing-function: ease-out;
            }
            10% {
              text-shadow: rgb(232, 60, 60) 1px 0 15px;
              animation-timing-function: ease-in;
            }
            17% {
              text-shadow: rgb(232, 60, 60) 1px 0 28px;
              animation-timing-function: ease-out;
            }
            33% {
              text-shadow: rgb(232, 60, 60) 1px 0 13px;
              animation-timing-function: ease-in;
            }
            45% {
              text-shadow: rgb(232, 60, 60) 1px 0 11px;
              animation-timing-function: ease-out;
            }
          }

          .description {
            position: absolute;
            width: 227px;
            height: 37px;
            left: calc(50% - 227px / 2);
            top: calc(50% - 37px / 2 - 51px);

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            line-height: 28px;
            align-items: center;
            text-align: center;

            color: #000000;
          }

          .buttonContainer {
            position: absolute;
            display: flex;
            flex-direction: column;
            top: 55%;
            left: 50%;
            transform: translate(-50%, 0);
          }

          .startButton {
            padding: 10px 0;
            width: 186px;
            height: 54px;
            color: white;

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;

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

          .startButton:active {
            transform: translate(0, 2px);
          }

          .galleryButton {
            padding: 10px 0;
            width: 186px;
            height: 54px;

            margin-top: 10px;

            color: white;

            font-family: Roboto;
            font-style: normal;
            font-weight: 500;
            font-size: 24px;
            letter-spacing: 0.1em;

            background: linear-gradient(
              180deg,
              #101010 -22.45%,
              rgba(196, 196, 196, 0) 485.71%
            );
            box-sizing: border-box;
            box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

            text-align: center;
            outline: none;
            cursor: pointer;
          }

          .galleryButton:active {
            transform: translate(0, 2px);
          }
        `}
      </style>
    </div>
  );
}
