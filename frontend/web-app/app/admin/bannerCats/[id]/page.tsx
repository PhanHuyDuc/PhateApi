import BannerCategoryForm from "@/components/admin/bannerCategory-form";
import { getBannerCatById } from "@/lib/actions/bannerCategory.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Banner",
};

export type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateBannerCategory({ params }: Props) {
  const { id } = await params;
  const data = await getBannerCatById(id);

  return (
    <>
      <h2 className="h2-bold">Update Banner Category</h2>
      <div className="my-8">
        <div className=" w-full justify-between space-x-5 ">
          <BannerCategoryForm bannerCats={data} />
        </div>
      </div>
    </>
  );
}
