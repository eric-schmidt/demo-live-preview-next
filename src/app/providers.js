"use client";

import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";
import React from "react";

export function Providers({ children, draftModeEnabled }) {
  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={true || draftModeEnabled}
      enableLiveUpdates={true || draftModeEnabled}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
}
