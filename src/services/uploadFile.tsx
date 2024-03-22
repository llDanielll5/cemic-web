import react, { useState, useEffect } from "react";
// import { storage } from "./firebase";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

const uploadFile = async (imgPath: string, imgName: string, file: any) => {
  // const storageRef = ref(storage, `${imgPath}/${imgName}`);
  // const uploadTask = uploadBytesResumable(storageRef, file);
  // return await uploadBytes(storageRef, file)
  //   .then(async (snapshot) => {
  //     const imgUrl = await getDownloadURL(snapshot.ref);
  //     return {
  //       state: "Success",
  //       url: imgUrl,
  //     };
  //   })
  //   .catch((err) => {
  //     return {
  //       state: "Error",
  //       url: "",
  //     };
  //   });
};

export default uploadFile;
