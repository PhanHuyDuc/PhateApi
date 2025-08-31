import { Banner, PagedResult } from "@/types";
import { create } from "zustand";

type State = {
  banners: Banner[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Banner>) => void;
};

const initialState: State = {
  banners: [],
  pageCount: 0,
  totalCount: 0,
};

export const useBannerStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Banner>) => {
    set(() => ({
      banners: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
