import { NextApiRequest, NextApiResponse } from "next";
var convertapi = require("convertapi")(process.env.CONVERTAPI_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let { fileLink } = req.body;

  if (!fileLink) return res.json("include a file!");

  try {
    convertapi
      .convert(
        "txt",
        {
          File: fileLink,
        },
        "pdf"
      )
      .then((result: any) => {
        console.log(result.response.Files[0].Url);
        let convertedLink = result.response.Files[0].Url;
        res.json(convertedLink);
      });
  } catch (error) {
    res.json(error);
  }
};
