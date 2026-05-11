import { create } from 'zustand';

interface UIStore {
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeDropdown: string | null;
  scrollY: number;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
  setActiveDropdown: (id: string | null) => void;
  setScrollY: (y: number) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeDropdown: null,
  scrollY: 0,

  toggleSidebar: () => {
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen }));
  },

  setSidebarOpen: (open: boolean) => {
    set({ isSidebarOpen: open });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  setMobileMenuOpen: (open: boolean) => {
    set({ isMobileMenuOpen: open });
  },

  toggleSearch: () => {
    set((state) => ({ isSearchOpen: !state.isSearchOpen }));
  },

  setSearchOpen: (open: boolean) => {
    set({ isSearchOpen: open });
  },

  setActiveDropdown: (id: string | null) => {
    set({ activeDropdown: id });
  },

  setScrollY: (y: number) => {
    set({ scrollY: y });
  },
}));
