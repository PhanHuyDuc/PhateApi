import WebInfoForm from "@/components/admin/webinfo-form";
import { getWebInfoById } from "@/lib/actions/WebInfo.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Menu",
};

export type Props = {
  params: Promise<{ id: string }>;
};
export default async function UpdateWebInfo({ params }: Props) {
  const { id } = await params;
  const data = await getWebInfoById(id);
  return (
    <>
      <WebInfoForm webInfo={data} />
    </>
  );
}
