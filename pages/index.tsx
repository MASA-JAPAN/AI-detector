import Router from "next/router";

const IndexPage = () => (
  <div>
    <div className="title">WIT</div>
    <div className="description">What is this?</div>
    <div
      className="startButton"
      onClick={() =>
        Router.push({
          pathname: "/detect",
        })
      }
    >
      <div className="startRectangle">
        <div className="textStart">Start</div>
      </div>
    </div>
    <div className="galleryButton">
      <div className="galleryRectangle">
        <div className="textGallery">Gallery</div>
      </div>
    </div>

    <style jsx>
      {`
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
          width: 171px;
          height: 49px;
          left: calc(50% - 171px / 2);
          top: calc(50% - 49px / 2 + 42px);
        }
        .startRectangle {
          position: absolute;
          left: 0%;
          right: 0%;
          top: 0%;
          bottom: 0%;

          background: linear-gradient(
            180deg,
            #0061f2 -22.45%,
            rgba(196, 196, 196, 0) 485.71%
          );
          border: 1px solid #1a6eec;
          box-sizing: border-box;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 13px;
        }
        .textStart {
          position: absolute;
          width: 119px;
          height: 31px;
          left: calc(50% - 119px / 2);
          top: calc(50% - 31px / 2);

          font-family: Roboto;
          font-style: normal;
          font-weight: 500;
          font-size: 24px;
          line-height: 28px;
          align-items: center;
          text-align: center;
          letter-spacing: 0.1em;

          color: #ffffff;
        }
        .galleryButton {
          position: absolute;
          width: 171px;
          height: 49px;
          left: calc(50% - 171px / 2);
          top: calc(50% - 49px / 2 + 120px);
        }

        .galleryRectangle {
          position: absolute;
          left: 0%;
          right: 0%;
          top: 0%;
          bottom: 0%;

          background: linear-gradient(
            180deg,
            #101010 -22.45%,
            rgba(196, 196, 196, 0) 485.71%
          );
          border: 1px solid #333333;
          box-sizing: border-box;
          box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
          border-radius: 13px;
        }
        .textGallery {
          position: absolute;
          width: 119px;
          height: 31px;
          left: calc(50% - 119px / 2);
          top: calc(50% - 31px / 2);

          font-family: Roboto;
          font-style: normal;
          font-weight: 500;
          font-size: 24px;
          line-height: 28px;
          align-items: center;
          text-align: center;
          letter-spacing: 0.1em;

          color: #ffffff;
        }
      `}
    </style>
  </div>
);

export default IndexPage;
