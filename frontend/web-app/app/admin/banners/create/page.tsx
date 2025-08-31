import BannerForm from "@/components/admin/banner-form";
import { getAdminBannerCat } from "@/lib/actions/bannerCategory.actions";

export default async function CreateBanner() {
  const bannerCat = await getAdminBannerCat("");
  const categories = bannerCat.results;
  return (
    <>
      <h2 className="h2-bold">Create Banner</h2>
      <div className="my-8">
        <BannerForm bannerCats={categories} />
      </div>
    </>
  );
}
