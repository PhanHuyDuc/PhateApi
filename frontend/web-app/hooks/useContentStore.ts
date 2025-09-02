import { PagedResult, Content } from "@/types";
import { create } from "zustand";

type State = {
  contents: Content[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Content>) => void;
};

const initialState: State = {
  contents: [],
  pageCount: 0,
  totalCount: 0,
};

export const useContentStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Content>) => {
    set(() => ({
      contents: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
