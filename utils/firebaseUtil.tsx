import firebase from "firebase/app";
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

const storage = firebase.storage();

const uploadImage = async (
  file: any,
  detectedName: string,
  result: { className: string; probability: number }[]
) => {
  console.log(process.env.FIREBASE_STORAGE_BUCKET);

  const storageRef = storage.ref();
  const saveImageRef = storageRef.child(`detectedImage/${uuidv4()}`);
  await saveImageRef
    .put(file, {
      customMetadata: {
        detectedName: detectedName,
        result0: result[0].className,
        result1: result[1].className,
        result2: result[2].className,
      },
    })
    .then(function (snapshot) {
      console.log(snapshot);
    })
    .catch(function (error) {
      // The document probably doesn't exist.
      console.error("Error deleting storage: ", error);
    });
};

export { uploadImage };
