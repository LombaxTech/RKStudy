import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("started doing something");

    setTimeout(async () => {
      await addDoc(collection(db, "test"), {
        x: 10,
        y: 20,
        createdAt: new Date(),
      });

      console.log("added!");
    }, 8000);

    res.json({ success: true, message: "it worked!" });
  } catch (error) {
    res.json(error);
  }
};
