import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "./AuthContext";

// Create Context
const DashboardLcmContext = createContext();

// Provider Component
export const DashboardLcmProvider = ({ children, roleIds  }) => {
    const { user } = useAuth();
    const resolvedRoleIds = roleIds || user?.jobs;
    console.log(resolvedRoleIds, 'bs')

    const { data: daysLcm = [], isLoading, error, refetch } = useQuery({
        queryKey: ["day_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`day_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: pendingLcm = {}, isLoading: isPendingLoading } = useQuery({
        queryKey: ["pending_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`pending_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: expiredLcm = {}, isLoading: isExpiredLoading } = useQuery({
        queryKey: ["expired_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`expired_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: paidLcm = {}, isLoading: isPaidLoading } = useQuery({
        queryKey: ["paid_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`paid_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: ytdLcm = {}, isLoading: isYtdLoading } = useQuery({
        queryKey: ["year_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`year_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: pendingYtdLcm = {}, isLoading: isPendingYtdLoading } = useQuery({
        queryKey: ["pdyear_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`pdyear_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: expiredYtdLcm = {}, isLoading: isExpiredYtdLoading } = useQuery({
        queryKey: ["exyear_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`exyear_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: paidYtdLcm = {}, isLoading: isPaidYtdLoading } = useQuery({
        queryKey: ["paiyear_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`paiyear_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: totalLcm = {}, isLoading: isTotalLoading } = useQuery({
        queryKey: ["lcm_rt", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`lcm_rt?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: totalMonthLcm = {}, isLoading: isTotalMonthLoading } = useQuery({
        queryKey: ["lcm_monthrt", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`lcm_monthrt?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: grafikStudentLcm = {}, isLoading: isGrafikLoading } = useQuery({
        queryKey: ["stulast_year_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`stulast_year_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: grafikRevenueLcm = {}, isLoading: isGrafikRLoading } = useQuery({
        queryKey: ["pailast_year_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`pailast_year_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: studentY = {}, isLoading: isRevenueYLoading } = useQuery({
        queryKey: ["mrlc_rt", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`mrlc_rt?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: studentM = {}, isLoading: isRevenueMLoading } = useQuery({
        queryKey: ["mrlc_monthrt", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`mrlc_monthrt?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: sourceLcm = {}, isLoading: isSourceLcmLoading } = useQuery({
        queryKey: ["source_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`source_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: waitTodayLcm = {}, isLoading: isWaitTodayLcmLoading } = useQuery({
        queryKey: ["wait_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`wait_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const { data: waitYearLcm = {}, isLoading: isWaitYearLcmLoading } = useQuery({
        queryKey: ["waityear_lcm", resolvedRoleIds],
        queryFn: () => axiosInstance.get(`waityear_lcm?role_ids=${resolvedRoleIds}`).then(res => res.data),
        staleTime: 1000 * 60 * 60 * 1,
        cacheTime: 1000 * 60 * 60 * 2,
    });

    const isAnyLoading =
        isLoading || isPendingLoading || isExpiredLoading || isPaidLoading ||
        isYtdLoading || isPendingYtdLoading || isExpiredYtdLoading || isPaidYtdLoading ||
        isTotalLoading || isGrafikLoading || isGrafikRLoading || isRevenueYLoading ||
        isRevenueMLoading || isSourceLcmLoading || isWaitTodayLcmLoading || isWaitYearLcmLoading || isTotalMonthLoading;

    return (
        <DashboardLcmContext.Provider
            value={{
                daysLcm, pendingLcm, expiredLcm, paidLcm, ytdLcm, pendingYtdLcm, expiredYtdLcm, paidYtdLcm,
                totalLcm, totalMonthLcm, grafikStudentLcm, grafikRevenueLcm, studentY, studentM, sourceLcm,
                waitTodayLcm, waitYearLcm, isAnyLoading, error, refetch,
            }}
        >
            {children}
        </DashboardLcmContext.Provider>
    );
};

// Custom Hook for Context
export const useDashboardLcm = () => useContext(DashboardLcmContext);
