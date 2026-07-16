import React, { Suspense } from "react";
import { draftMode } from "next/headers";
import { getEntriesBySlug } from "@/src/lib/client";
import { ComponentResolver } from "@/src/components/ComponentResolver";
import { LivePreviewResolver } from "@/src/components/LivePreviewResolver";
import { notFound } from "next/navigation";

// Server Component that performs the request-time reads (params + draftMode)
// and the Contentful fetch. Isolated so it can sit inside a <Suspense>
// boundary — under Cache Components any uncached request-time access must
// be wrapped in Suspense.
const PageBody = async ({ params }) => {
  const { slug } = await params;
  const { isEnabled } = await draftMode();
  // Sometimes it is helpful to override Draft Mode when testing.
  // const isEnabled = true;

  const landingPages = await getEntriesBySlug({
    preview: isEnabled,
    contentType: "page",
    slug,
    includeDepth: 1,
  });

  if (landingPages.length === 0) {
    notFound();
  }

  // Draft: use the client-side resolver so Live Preview updates stream in.
  // Published: use the server-side resolver so we ship zero Live Preview JS
  // to the client for cached page renders.
  const Resolver = isEnabled ? LivePreviewResolver : ComponentResolver;

  return landingPages.map((landingPage) =>
    landingPage.fields.topSection?.map((entry) => (
      <Resolver key={entry.sys.id} entry={entry} />
    ))
  );
};

const landingPage = (props) => {
  return (
    <Suspense fallback={null}>
      <PageBody params={props.params} />
    </Suspense>
  );
};

export default landingPage;
