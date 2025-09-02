import ImageLoader from "@/components/shared/image-loader";
import ScrollToTopButton from "@/components/shared/scroll-to-top-button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getContentBySlug } from "@/lib/actions/content.actions";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ContentDetails({ params }: Props) {
  const { slug } = await params;
  const content = await getContentBySlug(slug);
  const images = content.contentImages;
  if (!content) {
    return notFound();
  }
  return (
    <>
      <div className="my-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/contents">Contents</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{content.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="place-content-center">
        {content && content.contentImages ? (
          images.map((img) => (
            <ImageLoader
              key={img.id}
              src={img.url}
              alt={img.order.toString()}
              height={720}
              width={1080}
            />
          ))
        ) : (
          <div>Not image yet</div>
        )}
      </div>
      <ScrollToTopButton />
    </>
  );
}
