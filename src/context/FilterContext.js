import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
  const [filterValue, setFilterValue] = useState(null);

  return (
    <FilterContext.Provider value={{ filterValue, setFilterValue }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => useContext(FilterContext);
