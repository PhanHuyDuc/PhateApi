import { Menu, PagedResult } from "@/types";
import { create } from "zustand";

type State = {
  menus: Menu[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Menu>) => void;
};

const initialState: State = {
  menus: [],
  pageCount: 0,
  totalCount: 0,
};

export const useMenuStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Menu>) => {
    set(() => ({
      menus: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
