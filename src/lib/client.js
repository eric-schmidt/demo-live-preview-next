import resolveResponse from "contentful-resolve-response";

export const getLinksToEntryById = async ({ entryId }) => {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV_ID}/entries?links_to_entry=${entryId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CONTENTFUL_DELIVERY_KEY}`,
      },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return await res.json();
};

export const getEntriesBySlug = async ({
  preview,
  contentType,
  slug,
  includeDepth = 10,
}) => {
  // Determine whether to use the preview or delivery domain + API key.
  const domain = preview ? "preview.contentful.com" : "cdn.contentful.com";
  const apiKey = preview
    ? process.env.CONTENTFUL_PREVIEW_KEY
    : process.env.CONTENTFUL_DELIVERY_KEY;

  const res = await fetch(
    `https://${domain}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV_ID}/entries?content_type=${contentType}&fields.slug=${slug}&include=${includeDepth}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { tags: [slug] },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  // Uses https://github.com/contentful/contentful-resolve-response to
  // automatically resolve references.
  return resolveResponse(await res.json());
};
