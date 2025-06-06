import { MediaData } from "@/assets/types";
import React, {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

interface SeeAllContextProps {
  children: ReactNode;
}

interface SeeAllData {
  title: string;
  data: MediaData[];
  mediaType: string;
}

interface SeeAllContextValue {
  seeAllData: SeeAllData;
  setSeeAll: (title: string, data: MediaData[], mediaType: string) => void;
}

const GlobalContext = createContext<SeeAllContextValue | undefined>(undefined);

export const GlobalProvider: React.FC<SeeAllContextProps> = ({ children }) => {
  const [seeAllData, setSeeAllData] = useState<SeeAllData>({
    title: "",
    data: [],
    mediaType: "",
  });

  const setSeeAll = (title: string, data: MediaData[], mediaType: string) => {
    setSeeAllData({ title, data, mediaType });
  };

  const contextValue = useMemo(
    () => ({ seeAllData, setSeeAll }),
    [seeAllData, setSeeAll]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useSeeAll must be used within a GlobalContext Provider");
  }
  return context;
};
