import { createContext, useContext } from "react";

export const AppVariantContext = createContext({
  variant: "",
  isDesktop: false,
  isMobile: false,
});

export const useAppVariant = () => useContext(AppVariantContext);