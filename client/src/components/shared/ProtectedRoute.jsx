import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * PURPOSE:
 *   A route guard component. Wraps protected pages — if the user is not
 *   authenticated, they're redirected to /login before any protected content renders.
 *
 *   Uses React Router's <Outlet> to render the matched child route when auth passes.
 *
 * REQUEST FLOW:
 *   Router matches /dashboard → ProtectedRoute renders → checks useAuth()
 *   → if authenticated: renders <Outlet> (the dashboard page)
 *   → if not: <Navigate to="/login"> (redirect, replaces history entry)
 *
 *   While session is being restored (loading: true), shows a spinner so
 *   the user isn't flash-redirected to login on page refresh.
 *
 * USAGE in App.jsx:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 */

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Session restoration in progress — don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-ink-500 text-sm font-mono">Restoring session...</p>
        </div>
      </div>
    );
  }

  // replace: true prevents the protected URL from sitting in history
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
