import { NextApiRequest, NextApiResponse } from "next";

import { createWorker } from "tesseract.js";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { img } = req.body;

  try {
    // res.json("ocr stuff!!!");

    const worker = await createWorker("eng");
    const ret = await worker.recognize(img);
    console.log(ret);
    console.log(ret.data.text);
    await worker.terminate();

    res.json({ success: true, text: ret.data.text });
  } catch (error) {
    console.log(error);
  }
}
