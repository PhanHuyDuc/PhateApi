import { PagedResult, Product } from "@/types";
import { create } from "zustand";

type State = {
  products: Product[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Product>) => void;
};

const initialState: State = {
  products: [],
  pageCount: 0,
  totalCount: 0,
};

export const useProductStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Product>) => {
    set(() => ({
      products: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
