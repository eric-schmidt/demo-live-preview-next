import { ComponentMap } from "@/src/components/ComponentMap";

export const ComponentResolver = ({ component }) => {
  const Component = ComponentMap[component.sys.contentType.sys.id];

  return <Component component={component} />;
};
