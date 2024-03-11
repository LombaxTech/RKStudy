import { openai } from "@/openai";
import { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { message } = req.body;

  try {
    // const completion = await openai.chat.completions.create({
    //   messages: [
    //     {
    //       role: "system",
    //       content:
    //         "You are a helpful assistant designed to help users with social media.",
    //     },
    //     { role: "user", content: message },
    //   ],
    //   model: "gpt-3.5-turbo-0125",
    //   //   response_format: { type: "json_object" },
    // });
    // const result = completion.choices[0].message.content;

    // res.json({ message: "success", result });

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      max_tokens: 2000,
      // response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              // text: "generate a quiz from this image or file. The quiz is going to be used for revision. Return your quiz as JSON so that it can be used in next js app",
              text: "Can you describe this image? Could   ",
              // text: "generate a quiz from this image or file. The quiz is going to be used for revision. Return your quiz as JSON so that it can be used in next js app",
            },
            {
              type: "image_url",
              image_url: {
                // url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                url: "https://i.pinimg.com/564x/8e/25/e1/8e25e12e84dcef7f5854164099e3e545.jpg",
              },
            },
          ],
        },
      ],
    });
    console.log(response.choices[0]);
    res.json({ success: true, answer: response.choices[0] });
  } catch (error) {
    console.log("there has been an error");
    res.json(error);
  }
}
