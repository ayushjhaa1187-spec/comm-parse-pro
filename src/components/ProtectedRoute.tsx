import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { DashboardSkeleton } from "@/components/SkeletonLoader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <DashboardSkeleton />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
