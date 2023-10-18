// Provide mapping based on name in Contentful and point to JSX code responsible for rendering the content.
import dynamic from "next/dynamic";

// TODO: Add additional mapping for more component types.
export const ComponentMap = {
  componentHeroBanner: dynamic(() => import("@/src/components/Hero")),
  componentDuplex: dynamic(() => import("@/src/components/Duplex")),
};
