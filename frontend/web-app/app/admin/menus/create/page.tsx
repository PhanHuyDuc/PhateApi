import MenuForm from "@/components/admin/menu-form";
import { getAllMenu } from "@/lib/actions/menu.actions";

export default async function CreateMenu() {
  const menus = await getAllMenu();
  return (
    <div>
      <MenuForm menus={Array.isArray(menus) ? menus : [menus]} />
    </div>
  );
}
