import { createClient } from "contentful";
import { cacheLife, cacheTag } from "next/cache";
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

// Cached fetch used for the public Delivery API. The "use cache" directive
// caches the return value keyed on the function arguments; cacheTag() is
// called with every referenced entry's sys.id so that a webhook publish for
// any of them invalidates this page cache.
const getPublishedEntriesBySlug = async ({
  contentType,
  slug,
  includeDepth = 10,
}) => {
  "use cache";
  cacheLife("contentful");

  const client = getClient({ preview: false });

  try {
    const response = await client.getEntries({
      content_type: contentType,
      include: includeDepth,
      "fields.slug": slug,
    });
    // Prevent circular reference errors.
    const items = JSON.parse(safeJsonStringify(response.items));

    for (const item of items) {
      cacheTag(item.sys.id);
    }
    for (const entry of response.includes?.Entry ?? []) {
      cacheTag(entry.sys.id);
    }
    for (const asset of response.includes?.Asset ?? []) {
      cacheTag(asset.sys.id);
    }

    return items;
  } catch (error) {
    console.error("Error fetching entries:", error);
    throw error;
  }
};

// Public API: dispatches on preview so the cached branch's "use cache"
// directive stays static. Preview / Draft Mode reads bypass the cache
// entirely — the Contentful Preview API must not be cached.
export const getEntriesBySlug = async ({
  preview = false,
  contentType,
  slug,
  includeDepth = 10,
}) => {
  if (preview) {
    const client = getClient({ preview: true });
    try {
      const response = await client.getEntries({
        content_type: contentType,
        include: includeDepth,
        "fields.slug": slug,
      });
      return JSON.parse(safeJsonStringify(response.items));
    } catch (error) {
      console.error("Error fetching preview entries:", error);
      throw error;
    }
  }

  return getPublishedEntriesBySlug({ contentType, slug, includeDepth });
};
