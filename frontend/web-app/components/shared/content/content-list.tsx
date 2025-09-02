import { Content } from "@/types";
import ContentCard from "./content-card";

type Props = {
  contents: Content[];
};
const ContentList = ({ contents }: Props) => {
  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">List Content</h2>
      {contents && contents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {contents.map((content) => (
            <ContentCard key={content.slug} content={content} />
          ))}
        </div>
      ) : (
        <div>
          <p>No contents found</p>
        </div>
      )}
    </div>
  );
};

export default ContentList;
