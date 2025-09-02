type Props = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function SearchPage({ searchParams }: Props) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "all",
    page = "1",
  } = await searchParams;
  return <div>SearchPage</div>;
}
