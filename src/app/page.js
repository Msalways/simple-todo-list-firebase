"use client";
import { db } from "@/utils/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "@firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  return (
    <>
      <div className=" flex justify-center w-full p-5">
        <a href="/firestore" className=" border-spacing-2">
          Fire Store DB
        </a>
        <div className=" border-spacing-2 p-5"></div>
        <a href="/realtimeDB" className=" border-spacing-2">
          {" "}
          Real Time DB
        </a>
        <div className=" border-spacing-2 p-5"></div>
        <a href="/storage" className=" border-spacing-2">
          {" "}
          Storage
        </a>
      </div>
    </>
  );
}
