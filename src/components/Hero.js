"use client";

import {
  useContentfulInspectorMode,
  useContentfulLiveUpdates,
} from "@contentful/live-preview/react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import Image from "next/image";
import { imageLoader } from "../lib/imageLoader";

export const Hero = ({ entry }) => {
  const { fields } = useContentfulLiveUpdates(entry);
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry?.sys.id,
  });

  return (
    <>
      <div className="relative overflow-hidden">
        <div className="relative z-10 md:max-w-lg px-10 py-20 md:px-10 md:py-40">
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
          className="object-cover"
          loader={imageLoader}
          priority={true} // prevent Largest Contentful Paint issues
          fill={true} // add object fit w/o height/width requirement
          sizes="(min-width: 1280px) 1024px, (min-width: 780px) calc(90.83vw - 121px), calc(100vw - 96px)"
          src={`https:${fields.image?.fields.file.url}` || ""}
          alt={fields.image?.fields.title}
          {...inspectorProps({ fieldId: "image" })}
        />
      </div>
    </>
  );
};

export default Hero;
