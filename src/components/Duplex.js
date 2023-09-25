"use client";

import React from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import Image from "next/image";
import { imageLoader } from "../lib/imageLoader";

export const Duplex = ({ component }) => {
  const { fields } = useContentfulLiveUpdates(component);
  const inspectorProps = useContentfulInspectorMode({
    entryId: component?.sys.id,
  });

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 p-6 m-12">
        <div className="text-white flex flex-col justify-center">
          <h2
            className="text-2xl mb-4"
            {...inspectorProps({ fieldId: "headline" })}
          >
            {fields.headline || ""}
          </h2>

          <div {...inspectorProps({ fieldId: "bodyText" })}>
            {documentToReactComponents(fields.bodyText || "")}
          </div>
        </div>

        <Image
          loader={imageLoader}
          width={450}
          height={450}
          src={`https:${fields.image?.fields.file.url}` || ""}
          {...inspectorProps({ fieldId: "image" })}
          className={`order-first ${
            fields.containerLayout ? "md:order-first" : "md:order-last"
          }`}
          alt="Picture of the author"
        />
      </div>
    </>
  );
};

export default Duplex;
