import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getEntryById, getLinksToEntryById } from "../../../lib/client";

// E.g. http://localhost:3000/api/revalidate?secret=<secret>
// BUT this needs to use ngrok to work properly as a Webhook endpoint!!!

// Maintain a list of "page" content types for revalidation purposes.
const pageContentTypes = ["category", "page", "post"];

// Recursively find the page that needs to be revalidated by working up
// through the reference tree of entries that link to the triggering entry.
const findPageToRevalidate = async (entryId) => {
  const entry = await getEntryById({ entryId });

  if (pageContentTypes.includes(entry.sys.contentType.sys.id)) {
    revalidateTag(entry.fields.slug);
  } else {
    const linksToEntry = await getLinksToEntryById({
      entryId,
    });

    if (linksToEntry) {
      for (const entry of linksToEntry.items) {
        if (pageContentTypes.includes(entry.sys.contentType.sys.id)) {
          revalidateTag(entry.fields.slug);
        } else {
          await findPageToRevalidate(entry.sys.id);
        }
      }
    }
  }
};

export const POST = async (request) => {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.CONTENTFUL_REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid secret." }, { status: 401 });
  }

  // Get the payload data for parsing.
  const payload = await request.json();

  // If the payload does not include the entry ID of the triggering
  // entry, throw an error.
  if (typeof payload.entryId === undefined) {
    return NextResponse.json(
      { message: "Missing Entry ID in payload." },
      { status: 400 }
    );
  }

  // Otherwise, find the page to revalidate.
  await findPageToRevalidate(payload.entryId);

  return NextResponse.json({ revalidated: true, now: Date.now() });
};
