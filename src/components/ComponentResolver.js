import chalk from "chalk";
import React from "react";
import { ComponentMap } from "@/src/components/ComponentMap";

export const ComponentResolver = ({ entry }) => {
  const Component = ComponentMap[entry.sys.contentType.sys.id];

  // If there is no component in the mappings, return message.
  if (!Component) {
    console.log(chalk.red(`No Mapping for: ${entry.sys.contentType.sys.id}`));
    return;
  }

  return <Component entry={entry} />;
};
