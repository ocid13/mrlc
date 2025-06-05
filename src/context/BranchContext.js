import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

const BranchContext = createContext();
const ProgramContext = createContext();

export const BranchProvider = ({ children }) => {
  const { data, isLoadingB, error } = useQuery({
    queryKey: ["branches"],
    queryFn: async () => {
      const response = await axiosInstance.get("branches");
      return response.data;
    },
  });

  return (
    <BranchContext.Provider value={{ branches: data, isLoadingB, error }}>
      {children}
    </BranchContext.Provider>
  );
};

export const ProgramProvider = ({ children }) => {
  const {data, isLoadingP, errorP} = useQuery({
    queryKey: ["programs"],
    queryFn: async () => {
      const response = await axiosInstance.get("programs");
      return response.data;
    },
  });
  return (
    <ProgramContext.Provider value={{ programs: data, isLoadingP, errorP}}>
      {children}
    </ProgramContext.Provider>
  )
}

export const useBranch = () => useContext(BranchContext);
export const useProgram = () => useContext(ProgramContext);
