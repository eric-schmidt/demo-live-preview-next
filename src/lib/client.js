import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
import safeJsonStringify from "safe-json-stringify";

// Retrieve a Contentful client with various configured options.
export const getClient = ({ preview = false }) => {
  try {
    // If `preview` is true, use the Preview domain + API key, otherwise use Delivery.
    const domain = preview ? "preview.contentful.com" : "cdn.contentful.com";
    const apiKey = preview
      ? process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_KEY
      : process.env.NEXT_PUBLIC_CONTENTFUL_DELIVERY_KEY;

    return createClient({
      space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
      environment: process.env.NEXT_PUBLIC_CONTENTFUL_ENV_ID,
      accessToken: apiKey,
      host: domain,
      // Content Source Maps prevent the need for manually tagging components for
      // Live Preview Inspector Mode, but these are only available on the Preview API.
      includeContentSourceMaps: preview,
    });
  } catch (error) {
    console.error("Error initializing Contentful client:", error);
    throw error;
  }
};

// Get all entries from Contentful that are linking to a specifc entry.
export const getLinksToEntryById = async ({ entryId }) => {
  const client = getClient({ preview: false });

  try {
    return await client.getEntries({
      links_to_entry: entryId,
    });
  } catch (error) {
    console.error("Error fetching entries from Contentful:", error);
    throw error;
  }
};

// Get an individual entry from Contentful via its ID.
export const getEntryById = async ({ entryId, includeDepth = 10 }) => {
  const client = getClient({ preview: false });

  try {
    const response = await client.getEntries({
      "sys.id": entryId,
      include: includeDepth,
    });
    // Only return the first item since we are querying by ID.
    return response.items[0];
  } catch (error) {
    console.error("Error fetching entry:", error);
    throw error;
  }
};

// Get all entries from Contentful via their slug.
export const getEntriesBySlug = async ({
  preview = false,
  contentType,
  slug,
  includeDepth = 10,
}) => {
  const client = getClient({ preview });
  // Use the Next.js caching function so that we can revalidate when content is updated.
  const getCachedEntries = unstable_cache(
    async () => {
      try {
        const response = await client.getEntries({
          content_type: contentType,
          include: includeDepth,
          "fields.slug": slug,
        });
        // Prevent circular reference errors.
        return JSON.parse(safeJsonStringify(response.items));
      } catch (error) {
        console.error("Error fetching entries:", error);
        throw error;
      }
    },
    [`entries-${contentType}-${slug}`],
    { tags: [slug] }
  );

  try {
    return await getCachedEntries();
  } catch (error) {
    console.error("Error fetching cached entries:", error);
    throw error;
  }
};

// Get all entries of a specific Content Type from Contentful.
export const getEntriesByType = async ({
  preview = false,
  contentType,
  includeDepth = 10,
}) => {
  const client = getClient({ preview });

  try {
    const response = await client.getEntries({
      content_type: contentType,
      include: includeDepth,
    });
    return response.items;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};
