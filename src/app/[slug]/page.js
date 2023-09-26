import React from "react";
import { draftMode } from "next/headers";
import { getEntriesBySlug } from "@/src/lib/client";
import { ComponentResolver } from "@/src/components/ComponentResolver";

export const landingPage = async ({ params }) => {
  // Check if Draft Mode is enabled.
  let { isEnabled: draftModeEnabled } = draftMode();

  const landingPages = await getEntriesBySlug({
    preview: draftModeEnabled,
    contentType: "page",
    slug: params.slug,
    includeDepth: 2,
  });

  return (
    <div className="z-10 w-full max-w-5xl items-center justify-between text-sm lg:flex">
      <header className="App-header">
        {landingPages &&
          landingPages.map((landingPage) =>
            landingPage.fields.topSection?.map((component) => (
              <ComponentResolver
                key={component.sys.contentType.sys.id}
                component={component}
              />
            ))
          )}
      </header>
    </div>
  );
};

export default landingPage;
