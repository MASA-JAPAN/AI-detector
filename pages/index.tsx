import Router from "next/router";

const IndexPage = () => (
  <div>
    <div className="container">
      <video muted autoPlay loop className="topVideo">
        <source src="/videos/top.mp4" type="video/mp4" />
      </video>
      <div className="title">WIT</div>
      <div className="description">What is this?</div>

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
    </div>

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

    <style jsx>
      {`
        .container {
          position: relative;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
        }
        .topVideo {
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

        .startButton {
          position: absolute;
          padding: 10px 0;
          width: 185px;
          top: 54%;
          left: 50%;
          transform: translate(-50%, -50%);

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

        .galleryButton {
          position: absolute;
          padding: 10px 0;
          width: 185px;
          top: 63%;
          left: 50%;
          transform: translate(-50%, -50%);

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
      `}
    </style>
  </div>
);

export default IndexPage;
