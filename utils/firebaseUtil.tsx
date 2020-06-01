import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGIN_SENDER_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
} else {
  firebase.app();
}

const firestore = firebase.firestore();
const storage = firebase.storage();

const uploadImage = async (
  file: any,
  detectedName: string,
  result: { className: string; probability: number }[]
) => {
  const storageRef = storage.ref();
  const saveImageRef = storageRef.child(`detectedImage/${uuidv4()}`);

  await resizeImage(file, 500, 500).then(async (Blob) => {
    console.log("aaa");

    await saveImageRef
      .put(Blob, {
        customMetadata: {
          detectedName: detectedName,
          result0: result[0].className,
          result1: result[1].className,
          result2: result[2].className,
        },
      })
      .then(async function (snapshot) {
        console.log(snapshot.metadata.fullPath);

        await storageRef
          .child(snapshot.metadata.fullPath)
          .getDownloadURL()
          .then(async function (url) {
            const now = new Date();
            await firestore.collection("imageInfos").add({
              detectedName: detectedName,
              result0: result[0].className,
              result1: result[1].className,
              result2: result[2].className,
              url: url,
              createdDate:
                String(now.getFullYear()) +
                "-" +
                String(now.getMonth() + 1) +
                "-" +
                String(now.getDate()) +
                "-" +
                String(now.getHours()) +
                "-" +
                String(now.getMinutes()) +
                "-" +
                String(now.getSeconds()),
            });
          })
          .catch(function (error) {
            // Handle any errors
            console.log(error);
          });
      })
      .catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error deleting storage: ", error);
      });
  });
};

function resizeImage(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    let image = new Image();
    image.src = URL.createObjectURL(file);
    image.onload = () => {
      let width = image.width;
      let height = image.height;

      if (width <= maxWidth && height <= maxHeight) {
        resolve(file);
      }

      let newWidth;
      let newHeight;

      if (width > height) {
        newHeight = height * (maxWidth / width);
        newWidth = maxWidth;
      } else {
        newWidth = width * (maxHeight / height);
        newHeight = maxHeight;
      }

      let canvas = document.createElement("canvas");
      canvas.width = newWidth;
      canvas.height = newHeight;

      let context = canvas.getContext("2d");

      if (context) {
        context.drawImage(image, 0, 0, newWidth, newHeight);
      }

      canvas.toBlob(function (blob) {
        // return blob;
        if (blob) {
          resolve(blob);
        }
      }, file.type);
    };
    image.onerror = reject;
  });
}
const getImageInfos = async (limitNumber: number) => {
  let imageInfos: Object[] = new Array();
  await firestore
    .collection("imageInfos")
    .orderBy("createdDate", "desc")
    .limit(limitNumber)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        imageInfos.push({
          id: doc.id,
          ...doc.data(),
        });
      });
    })
    .catch(function (error) {
      console.log("Error getting documents: ", error);
    });

  return imageInfos;
};

export { uploadImage, getImageInfos };
