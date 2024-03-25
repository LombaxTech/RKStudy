import { openai } from "@/openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { textContent } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful notes generator. The notes should be based on the content the user provides.",
        },
        { role: "user", content: textContent },
      ],
      max_tokens: 2000,
      model: "gpt-3.5-turbo",
    });

    let notes = completion.choices[0].message.content;
    let full = completion.choices[0];
    res.json({ success: true, notes, full });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}
