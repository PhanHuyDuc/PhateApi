import { PagedResult, Artist } from "@/types";
import { create } from "zustand";

type State = {
  artists: Artist[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Artist>) => void;
};

const initialState: State = {
  artists: [],
  pageCount: 0,
  totalCount: 0,
};

export const useArtistStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Artist>) => {
    set(() => ({
      artists: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
