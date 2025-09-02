import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Content } from "@/types";
import Image from "next/image";
import Link from "next/link";
import ImageLoader from "../image-loader";
type Props = {
  content: Content;
};
const ContentCard = ({ content }: Props) => {
  const mainImage =
    content.contentImages && content.contentImages.length > 0
      ? content.contentImages.find((img) => img.isMain)?.url ||
        content.contentImages[0].url
      : "https://pixabay.com/photos/coffee-cup-cookies-mug-coffee-cup-1869599/"; // Fallback image
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="p-0 place-content-center">
        <Link href={`/contents/${content.slug}`}>
          <ImageLoader
            src={mainImage || ""}
            alt={content.name}
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{content.tag}</div>
        <Link href={`/contents/${content.slug}`}>
          <h2 className="text-sm font-medium">{content.name}</h2>
        </Link>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
