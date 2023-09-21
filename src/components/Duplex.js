import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const Duplex = ({ component }) => {
  const { fields } = component;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6 m-12">
        <div className="text-white flex flex-col justify-center">
          <h2 className="text-2xl mb-4">{fields.headline}</h2>
          <div>{documentToReactComponents(fields.bodyText)}</div>
        </div>
        <img
          className={`order-first ${
            fields.containerLayout ? "md:order-first" : "md:order-last"
          }`}
          src={`https:${fields.image.fields.file.url}`}
        />
      </div>
    </>
  );
};

export default Duplex;
