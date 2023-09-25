"use client";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import React from "react";

export function Providers({ children, isEnabled }) {
  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={true || isEnabled}
      enableLiveUpdates={true || isEnabled}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
}
