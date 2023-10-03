import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getLinksToEntryById } from "../../../lib/client";

// E.g. http://localhost:3000/api/revalidate?secret=<secret>
// BUT this needs to use ngrok to work properly as a Webhook endpoint!!!

export const POST = async (request) => {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.CONTENTFUL_REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  // Get the payload data for parsing.
  const payload = await request.json();

  // If the payload does not include the entry ID of the triggering
  // entry, throw an error.
  if (typeof payload.entityId === undefined) {
    return NextResponse.json(
      { message: "Missing Entity ID in payload." },
      { status: 400 }
    );
  }

  // Get a list of entries that link to the given entry that triggered
  // this webhook. If it is a "page" content type, get it's slug which
  // we can use to revalidate. The slug is typically used as the tag
  // fetching the data originally (e.g. in `/src/app/[slug]/page.js`).
  const pageContentTypes = ["page"];
  const linksToEntry = await getLinksToEntryById({ entryId: payload.entryId });

  // TODO: Add some recursion so that we can run up the tree and validate for upper level parents that also need revalidation.
  linksToEntry &&
    linksToEntry.items.forEach((entry) => {
      if (pageContentTypes.includes(entry.sys.contentType.sys.id)) {
        revalidateTag(entry.fields.slug);
      }
    });

  return NextResponse.json({ revalidated: true, now: Date.now() });
};
