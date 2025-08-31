import BannerForm from "@/components/admin/banner-form";
import ImageLoader from "@/components/shared/image-loader";
import { getBannerById } from "@/lib/actions/banner.actions";
import { getAdminBannerCat } from "@/lib/actions/bannerCategory.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Banner",
};

export type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateBanner({ params }: Props) {
  const { id } = await params;
  const data = await getBannerById(id);
  const bannerCat = await getAdminBannerCat("");
  const categories = bannerCat.results;
  return (
    <>
      <h2 className="font-bold">Update Banner</h2>
      <div className="my-8">
        <div className="grid grid-cols-2 w-full justify-between space-x-5 ">
          <BannerForm banner={data} bannerCats={categories} />
          <ImageLoader
            src={data.url}
            alt={data.title}
            height={400}
            width={400}
          />
        </div>
      </div>
    </>
  );
}
