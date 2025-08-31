import { getWebInfo } from "@/lib/actions/WebInfo.actions";
import DataTable from "./data-table";
import EmptyData from "@/components/shared/empty-data";


export default async function AdminInfoPage() {
  const data = await getWebInfo();
  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Website Info</h1>
      </div>
      <>{data && Array.isArray(data) && data.length > 0 ? <DataTable infos={data} /> : <EmptyData />}</>
    </div>
  );
}
