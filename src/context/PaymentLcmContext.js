import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";

// Create Context
const PaymentLcmContext = createContext();

// Fetch Function
const fetchPayments = async () => {
    try {
        const response = await axiosInstance.get("payment-lcm");
        return response.data;
    } catch (error) {
        console.error("Error fetching payments:", error);
        throw error;
    }
};

// Provider Component
export const PaymentLcmProvider = ({ children }) => {
    const queryClient = useQueryClient();

    const { data: payments = [], isLoading, isError, error, refetch, } = useQuery({
        queryKey: ["payment-lcm"],
        queryFn: fetchPayments,
        staleTime: 1000 * 60 * 5,
    });

    const updatePayment = useMutation({
        mutationFn: async ({ paymentId, newPaymentValue }) => {
            await axiosInstance.put(`/payment-lcm/${paymentId}/status`, {
                status: newPaymentValue,
            });
        },
        onSuccess: () => {
            // Refetch data otomatis setelah update
            queryClient.invalidateQueries(["payment-lcm"]);
        },
        onError: (err) => {
            console.error("Error updating payment status:", err);
        },
    });

    return (
        <PaymentLcmContext.Provider value={{ payments, isLoading, isError, error, refetchPayments: refetch, updatePayment, }}>
            {children}
        </PaymentLcmContext.Provider>
    );
};

// Custom Hook for Context
export const usePayments = () => useContext(PaymentLcmContext);
