import { openai } from "@/openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { textContent } = req.body;

  console.log("text content...");
  console.log(textContent);
  try {
    // res.json({ success: true, textContent });

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful quiz generator designed to output JSON. The quiz should be based on the content the user provides. The quiz format should be questions which is an array where each element contains questionText which is a string, options which is an array of strings, and correctAnswer which is a string and must be one of the options. The number of questions and options should be what the user asks for or if the user does not mention anything then decide by yourself",
        },
        { role: "user", content: textContent },
      ],
      max_tokens: 2000,
      model: "gpt-3.5-turbo",
      response_format: { type: "json_object" },
    });

    let answer = completion.choices[0].message.content;
    let full = completion.choices[0];
    res.json({ success: true, quiz: answer, full });
  } catch (error) {
    console.log(error);
    res.json(error);
  }
}

// questions: [
//     {
//       questionText: "Who issued the Emancipation Proclamation?",
//       options: [
//         "Abraham Lincoln",
//         "Thomas Jefferson",
//         "Andrew Jackson",
//         "George Washington",
//       ],
//       correctAnswer: "Abraham Lincoln",
//     },
