import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

// Create Context
const ProspectLcmContext = createContext();
const LeadsLcmContext = createContext();

// Fetch Functions
const fetchProspects = async (userJobs) => {
    const response = await axiosInstance.get("prospect?role_ids=" + userJobs);
    return response.data;
};

const fetchLeads = async (userJobs) => {
    const response = await axiosInstance.get("leads_lcm?role_ids=" + userJobs);
    return response.data;
};

// Provider Component
export const ProspectLcmProvider = ({ children }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const { data: prospects = [], isLoading, error } = useQuery({
        queryKey: ["prospects", user?.jobs],
        queryFn: () => fetchProspects(user?.jobs),
        enabled: !!user?.jobs,
        staleTime: 1000 * 60 * 5,
    });

    const updateProspectCall = useMutation({
        mutationFn: async ({ prospectId, newCallValue }) => {
            await axiosInstance.put(`prospect/${prospectId}`, { call2: newCallValue });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["prospects"]);
        },
    });

    return (
        <ProspectLcmContext.Provider value={{ prospects, isLoading, error, updateProspectCall }}>
            {children}
        </ProspectLcmContext.Provider>
    );
};

export const LeadsLcmProvider = ({ children }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    
    const { data: leads = [], isLoading, error } = useQuery({
        queryKey: ["leads_lcm", user?.jobs],
        queryFn: () => fetchLeads(user?.jobs),
        enabled: !!user?.jobs,
        staleTime: 1000 * 60 * 5,
    });    

    const updateLeadCall = useMutation({
        mutationFn: async ({ leadId, newCallValue }) => {
            await axiosInstance.put(`prospect/${leadId}`, { call: newCallValue });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["leads_lcm"]);
        },
    });

    return (
        <LeadsLcmContext.Provider value={{ leads, isLoading, error, updateLeadCall }}>
            {children}
        </LeadsLcmContext.Provider>
    );
};

// Custom Hook for Context
export const useProspects = () => useContext(ProspectLcmContext);
export const useLeadsLcm = () => useContext(LeadsLcmContext);
