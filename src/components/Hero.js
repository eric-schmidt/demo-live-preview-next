import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const Hero = ({ component }) => {
  const { fields } = component;

  return (
    <>
      <div className="relative">
        <div className="p-6 md:p-12 absolute inset-0 md:w-1/2 top-1/2 transform -translate-y-1/2 flex flex-col justify-center">
          <h1 className="text-xl lg:text-3xl mb-4">{fields.headline}</h1>
          <div className="text-md lg:text-lg">
            {documentToReactComponents(fields.bodyText)}
          </div>
          {/* TODO: Figure out how to get full URL from reference field (i.e. prefix + slug) */}
          <a href="/">{fields.ctaText}</a>
        </div>
        {/* TODO: Update this to use next/image + custom provider */}
        <img
          className="object-cover"
          src={`https:${fields.image.fields.file.url}`}
        />
      </div>
    </>
  );
};

export default Hero;
