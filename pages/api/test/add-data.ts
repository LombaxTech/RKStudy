import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await addDoc(collection(db, "test"), {
      createdAt: new Date(),
      note: "test creation",
    });

    res.json({ success: true, message: "it worked!" });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
};
