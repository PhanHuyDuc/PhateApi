import { Contact, PagedResult } from "@/types";
import { create } from "zustand";

type State = {
  contacts: Contact[];
  totalCount: number;
  pageCount: number;
};

type Actions = {
  setData: (data: PagedResult<Contact>) => void;
};

const initialState: State = {
  contacts: [],
  pageCount: 0,
  totalCount: 0,
};

export const useContactStore = create<State & Actions>((set) => ({
  ...initialState,

  setData: (data: PagedResult<Contact>) => {
    set(() => ({
      contacts: data.results,
      totalCount: data.totalCount,
      pageCount: data.pageCount,
    }));
  },
}));
