import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

// Buat context
const StudentLcmContext = createContext();

// Fungsi untuk fetch data student
const fetchStudents = async (userJobs) => {
    try {
        const response = await axiosInstance.get("students-lcm?role_ids=" + userJobs);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error fetching students:", error);
        throw error;
    }
};

// Provider Component
export const StudentLcmProvider = ({ children }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();

    const { data: students = [], isLoading, error, refetch } = useQuery({
        queryKey: ["students-lcm", user?.jobs],
        queryFn: () => fetchStudents(user?.jobs),
        enabled: !!user?.jobs,
        staleTime: 1000 * 60 * 5,
    });

    const updateStudent = useMutation({
        mutationFn: async ({ studentId, newStudentValue }) => {
            await axiosInstance.put(`/attendance/${studentId}`, {
                status: newStudentValue,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["students-lcm"]);
        },
        onError: (err) => {
            console.error("Error updating student status:", err);
        },
    });

    return (
        <StudentLcmContext.Provider value={{ students, isLoading, error, refetch, updateStudent }}>
            {children}
        </StudentLcmContext.Provider>
    );
};

// Custom hook
export const useStudents = () => {
    const context = useContext(StudentLcmContext);
    if (!context) {
        throw new Error("useStudents must be used within a StudentLcmProvider");
    }
    return context;
};
