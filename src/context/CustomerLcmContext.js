import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

// Create Context
const CustomerLcmContext = createContext();

// Fetch Functions
const fetchCustomers = async (userJobs) => {
    try {
        const response = await axiosInstance.get("interest-lcm?role_ids=" + userJobs);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching customers:", error);
        throw error;
    }
};

// Provider Component
export const CustomerLcmProvider = ({ children }) => {
    const { user } = useAuth();

    const { data: customers = [], isLoading, error } = useQuery({
        queryKey: ["interest-lcm", user?.jobs],
        queryFn: () => fetchCustomers(user?.jobs),
        enabled: !!user?.jobs,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <CustomerLcmContext.Provider value={{ customers, isLoading, error}}>
            {children}
        </CustomerLcmContext.Provider>
    );
};

// Custom Hook for Context
export const useCustomers = () => useContext(CustomerLcmContext);
