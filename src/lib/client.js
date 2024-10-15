import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
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
  // Define a cached function so that we can revalidate when content is updated.
  const getCachedEntries = unstable_cache(
    async () => {
      // If `preview` is true, us the Preview domain + API key, otherwise use Delivery.
      const domain = preview ? "preview.contentful.com" : "cdn.contentful.com";
      const apiKey = preview
        ? process.env.CONTENTFUL_PREVIEW_KEY
        : process.env.CONTENTFUL_DELIVERY_KEY;

      const client = createClient({
        space: process.env.CONTENTFUL_SPACE_ID,
        accessToken: apiKey,
        host: domain,
        // Content Source Maps prevent the need for manually tagging components for
        // Live Preview Inspector Mode, but these are only available on the Preview API.
        includeContentSourceMaps: preview,
      });

      try {
        const response = await client.getEntries({
          content_type: contentType,
          include: includeDepth,
          "fields.slug": slug,
        });

        console.log(JSON.parse(safeJsonStringify(response.items)));

        // Prevent circular reference errors.
        return JSON.parse(safeJsonStringify(response.items));
      } catch (error) {
        console.error("Error fetching entries from Contentful:", error);
        throw error;
      }
    },
    [`entries-${contentType}-${slug}`],
    { tags: [slug] }
  );

  try {
    const cachedData = await getCachedEntries();
    return cachedData;
  } catch (error) {
    console.error("Error retrieving cached entries:", error);
    throw error;
  }
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
