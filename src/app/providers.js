"use client";

import React from "react";
import { ContentfulLivePreviewProvider } from "@contentful/live-preview/react";

export const Providers = ({ children, draftModeEnabled }) => {
  return (
    <ContentfulLivePreviewProvider
      locale="en-US"
      enableInspectorMode={true || draftModeEnabled}
      enableLiveUpdates={true || draftModeEnabled}
    >
      {children}
    </ContentfulLivePreviewProvider>
  );
};
