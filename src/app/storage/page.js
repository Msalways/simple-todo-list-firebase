"use client";
import React, { useEffect, useState } from "react";
import {
  ref,
  uploadString,
  listAll,
  getDownloadURL,
  deleteObject,
} from "@firebase/storage";
import { storage } from "@/utils/firebaseConfig";

function Storage() {
  const [file, setFile] = useState("");
  const [baseUrl, setBaseUrl] = useState(null);

  const [listAllFiles, setListAllfiles] = useState([]);

  const handleListAllfiles = async () => {
    try {
      const storageRef = ref(storage, "/file");
      const listFiles = await listAll(storageRef);
      setListAllfiles(listFiles.items.map((val) => val.fullPath) ?? []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownloadFile = async (val) => {
    try {
      console.log(val);
      const storageRef = ref(storage, val);
      const url = await getDownloadURL(storageRef);
      console.log(url);
      if (url) {
      }
    } catch (error) {}
  };

  const handleDeleteFileFromFirebase = async (val) => {
    try {
      const storageRef = ref(storage, val);
      await deleteObject(storageRef);
      console.log("File deleted");
      await handleListAllfiles();
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    handleListAllfiles();
  });
  const handleOnChangeFile = async (e) => {
    try {
      const file = e.target.files[0];
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const fileContent = fileReader.result;
        // const fileBuffer = Buffer.from(fileContent, "base64");
        // const fileUrl = URL.createObjectURL(fileBuffer);
        setBaseUrl(fileReader.result);
      };

      fileReader.readAsDataURL(file);
      setFile(file.name);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUploadFile = async (e) => {
    try {
      const storageRef = ref(storage, `/file/${file}`);
      const uploadTask = await uploadString(storageRef, baseUrl);
      console.log(uploadTask.ref.fullPath);
      setBaseUrl(null);
      setFile("");
      await handleListAllfiles();
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" container flex flex-row w-screen h-screen justify-center p-96">
      <div className=" flex-1 ">
        <input type="file" onChange={handleOnChangeFile} />
        <button onClick={handleUploadFile}>Upload to Storage</button>
      </div>
      <div>
        {listAllFiles.map((val, index) => (
          <div className=" grid-flow-row p-5" key={index}>
            <button key={index} onClick={() => handleDownloadFile(val)}>
              Download File {index + 1}
            </button>
            <div>
              <button onClick={(e) => handleDeleteFileFromFirebase(val)}>
                Delete file
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Storage;
