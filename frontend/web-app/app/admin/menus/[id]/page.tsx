import MenuForm from "@/components/admin/menu-form";
import { getAllMenu, getMenuById } from "@/lib/actions/menu.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Menu",
};

export type Props = {
  params: Promise<{ id: string }>;
};
export default async function UpdateMenu({ params }: Props) {
  const { id } = await params;
  const data = await getMenuById(id);
  const menus = await getAllMenu();

  return (
    <>
      <h2 className="font-bold">Update Menu</h2>
      <div className="my-8">
        <div className=" w-full justify-between space-x-5">
          <MenuForm
            menu={data}
            menus={Array.isArray(menus) ? menus : [menus]}
          />
        </div>
      </div>
    </>
  );
}
