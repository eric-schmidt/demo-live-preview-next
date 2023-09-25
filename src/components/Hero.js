"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { imageLoader } from "../lib/imageLoader";

export const Hero = ({ component }) => {
  // const { fields } = component;
  const { fields } = useContentfulLiveUpdates(component);
  const inspectorProps = useContentfulInspectorMode({
    entryId: component?.sys.id,
  });

  return (
    <>
      <div className="relative">
        <div className="p-6 md:p-12 absolute md:w-1/2 top-1/2 transform -translate-y-1/2 flex flex-col justify-center">
          <h1
            className="text-xl lg:text-3xl mb-4"
            {...inspectorProps({ fieldId: "headline" })}
          >
            {fields.headline || ""}
          </h1>

          <div
            className="text-md lg:text-lg mb-4"
            {...inspectorProps({ fieldId: "bodyText" })}
          >
            {documentToReactComponents(fields.bodyText || "")}
          </div>

          <a
            className="p-2 w-fit inline-block bg-black"
            href={fields.targetPage?.fields?.slug || ""}
            {...inspectorProps({ fieldId: "ctaText" })}
          >
            {fields.ctaText || ""}
          </a>
        </div>

        <Image
          loader={imageLoader}
          width={1000}
          height={1000}
          src={`https:${fields.image?.fields.file.url}` || ""}
          {...inspectorProps({ fieldId: "image" })}
          alt="Picture of the author"
          className="object-cover"
        />
      </div>
    </>
  );
};

export default Hero;
