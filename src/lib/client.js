import resolveResponse from "contentful-resolve-response";
import safeJsonStringify from "safe-json-stringify";

export const getEntryById = async ({ entryId }) => {
  const res = await fetch(
    `https://cdn.contentful.com/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV_ID}/entries/${entryId}`,
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

export const getEntriesByType = async ({ preview = false, contentType }) => {
  // Determine whether to use the preview or delivery domain + API key.
  const domain = preview ? "preview.contentful.com" : "cdn.contentful.com";
  const apiKey = preview
    ? process.env.CONTENTFUL_PREVIEW_KEY
    : process.env.CONTENTFUL_DELIVERY_KEY;

  const res = await fetch(
    `https://${domain}/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENV_ID}/entries?content_type=${contentType}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
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
  preview = false,
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
      // Add cache tags that we can later invalidate via Contentful webhook.
      next: { tags: [slug] },
    }
  );

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  const jsonData = await res.json();

  // Uses https://github.com/contentful/contentful-resolve-response to automatically resolve references.
  const resolvedJsonData = resolveResponse(jsonData);

  // Uses https://github.com/debitoor/safe-json-stringify to prevent circular reference errors.
  const safeJsonData = JSON.parse(safeJsonStringify(resolvedJsonData));

  return safeJsonData;
};

export const getGraphQLResponse = async ({ query }) => {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CONTENTFUL_PREVIEW_KEY}`,
      },
      body: JSON.stringify({ query }),
    }
  );

  return await response.json();
};
