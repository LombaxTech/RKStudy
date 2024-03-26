import { NextApiRequest, NextApiResponse } from "next";
import { openai } from "@/openai";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { messages } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      // messages: [
      //   { role: "system", content: "You are a helpful assistant." },
      //   { role: "user", content: message },
      // ],
      messages,
      model: "gpt-3.5-turbo",
    });

    console.log(completion.choices[0]);
    const answer = completion.choices[0];

    const result = completion.choices[0].message.content;
    const message = completion.choices[0].message;

    res.json({ success: true, result, answer, message });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}
