import { ComponentMap } from "@/src/components/ComponentMap";

export const ComponentResolver = ({ entry }) => {
  const Component = ComponentMap[entry.sys.contentType.sys.id];

  return <Component entry={entry} />;
};
