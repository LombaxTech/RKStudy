import { contactAddress } from "@/data";
import React from "react";

export default function Feedback() {
  return (
    <div className="p-10 flex flex-col gap-4">
      <div className="mx-auto flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Thanks for using us!</h1>
        <div className="flex flex-col text-lg">
          <h2 className="">Have an idea for a new feature? Or found a bug?</h2>
          <h2 className="">
            We would love to hear from you! Please let us know and you might see
            your feature live soon!
          </h2>
        </div>
        <a href={`mailto:${contactAddress}`}>
          <button className="btn btn-primary w-fit">Get in touch</button>
        </a>
      </div>
      <div className="mt-10 flex justify-center">
        <img src={"/lightbulb.svg"} alt="" className="w-72" />
      </div>
    </div>
  );
}
