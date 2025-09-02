import ArtistForm from "@/components/admin/artist-form";

export default async function CreateAritst() {
  return (
    <>
      <h2 className="h2-bold">Create Artist</h2>
      <div className="my-8">
        <ArtistForm />
      </div>
    </>
  );
}
