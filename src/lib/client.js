import { createClient } from "contentful";

export const getEntriesBySlug = async ({ preview, contentType, slug }) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    host: preview ? "preview.contentful.com" : "cdn.contentful.com",
    accessToken: preview
      ? process.env.CONTENTFUL_PREVIEW_KEY
      : process.env.CONTENTFUL_DELIVERY_KEY,
  });

  try {
    const response = await client.getEntries({
      content_type: contentType,
      "fields.slug": slug,
    });
    return response.items;
  } catch (error) {
    console.log(error);
  }
};
