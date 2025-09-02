import ArtistForm from "@/components/admin/artist-form";
import { getArtistById } from "@/lib/actions/artist.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Artist",
};

export type Props = {
  params: Promise<{ id: string }>;
};

export default async function UpdateArtist({ params }: Props) {
  const { id } = await params;
  const data = await getArtistById(id);

  return (
    <>
      <h2 className="h2-bold">Update Artist</h2>
      <div className="my-8">
        <div className=" w-full justify-between space-x-5 ">
          <ArtistForm artists={data} />
        </div>
      </div>
    </>
  );
}
