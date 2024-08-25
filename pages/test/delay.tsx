import { db } from "@/firebase";
import axios from "axios";
import { addDoc, collection } from "firebase/firestore";
import React from "react";

export default function Test() {
  const doSomething = async () => {
    console.log("started doing something");

    setTimeout(async () => {
      await addDoc(collection(db, "test"), {
        x: 10,
        y: 20,
        createdAt: new Date(),
      });

      console.log("added!");
    }, 5000);
  };

  const doSomethingFromServer = async () => {
    try {
      let res = await axios.post("/api/test/delayed-adding-data");
      console.log(res.data);
      console.log("done!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={doSomething}>
        Add data later from browser
      </button>

      <button className="btn btn-secondary" onClick={doSomethingFromServer}>
        Add data later from server
      </button>
    </div>
  );
}
