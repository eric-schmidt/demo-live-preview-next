import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";
import { getEntriesBySlug } from "@/src/lib/client";

export const GET = async (request) => {
  // Parse query string parameters
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const type = searchParams.get("type");
  const slug = searchParams.get("slug");

  // Check the secret and next parameters
  // This secret should only be known to this route handler and the CMS
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET || !slug) {
    return new Response("Invalid token", { status: 401 });
  }

  // Get entry by slug.
  const entries = await getEntriesBySlug({
    preview: true,
    contentType: type,
    slug,
  });

  // If the slug doesn't exist prevent draft mode from being enabled
  if (!entries) {
    return new Response("Invalid slug", { status: 401 });
  }

  // Enable Draft Mode.
  draftMode().enable();

  // In order for Draft Mode to work within the context of Live Preview and/or Studio,
  // we need to ensure the cookie has sameSite=None and secure=true.
  // @see https://www.contentful.com/developers/docs/tutorials/preview/live-preview/#my-page-has-an-authorization-cookie-for-logging-in
  const draftModeCookie = cookies().get("__prerender_bypass");
  if (draftModeCookie) {
    // Set a new cookie with the same value but custom attributes
    cookies().set("__prerender_bypass", draftModeCookie.value, {
      secure: true,
      sameSite: "none",
      httpOnly: true,
      path: "/",
    });
  }

  // Redirect to the path from the fetched entry.
  // We don't redirect to searchParams.slug as that might lead to open redirect vulnerabilities
  redirect(`/${entries[0].fields.slug}`);
};
