import BannerCategoryForm from "@/components/admin/bannerCategory-form";

export default async function CreateBannerCategory() {
  return (
    <>
      <h2 className="h2-bold">Create Banner Category</h2>
      <div className="my-8">
        <BannerCategoryForm />
      </div>
    </>
  );
}
