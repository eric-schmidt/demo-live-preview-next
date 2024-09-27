import React, { Fragment } from "react";
import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getEntriesBySlug, getEntriesByType } from "@/src/lib/client";
import { Hero } from "@/src/components/Hero";

export const generateStaticParams = async () => {
  const posts = await getEntriesByType({ contentType: "post" });

  return posts.items.map((post) => ({ slug: post.fields.slug }));
};

export const blogPost = async ({ params }) => {
  const posts = await getEntriesBySlug({
    contentType: "post",
    slug: params.slug,
    includeDepth: 1,
  });

  if (posts.length === 0) {
    notFound();
  }

  return (
    <>
      {posts &&
        posts.map((post) => {
          return (
            <Fragment key={post.sys.id}>
              {/* Prevent circular reference errors. */}
              <Hero entry={post} />

              <div className="text-2xl p-6 mt-12">
                {documentToReactComponents(post.fields.introText)}
              </div>

              <div className="p-6 mt-12">
                {documentToReactComponents(post.fields.body)}
              </div>
            </Fragment>
          );
        })}
    </>
  );
};

export default blogPost;
