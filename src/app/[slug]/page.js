import React from "react";
import { createClient } from "contentful";
import { ComponentResolver } from "@/src/components/ComponentResolver";

const getLandingPages = async (slug) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_DELIVERY_KEY,
  });

  try {
    const response = await client.getEntries({
      content_type: "page",
      "fields.slug": slug,
    });
    return response.items;
  } catch (error) {
    console.log(error);
  }
};

export const landingPage = async ({ params }) => {
  const landingPages = await getLandingPages(params.slug);

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
