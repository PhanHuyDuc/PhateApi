import { BannerCategory, PagedResult } from "@/types";
import { create } from "zustand";

type State = {
  bannerCats: BannerCategory[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<BannerCategory>) => void;
};

const initialState: State = {
  bannerCats: [],
  pageCount: 0,
  totalCount: 0,
};

export const useBannerCatStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<BannerCategory>) => {
    set(() => ({
      bannerCats: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
