import { Dashboard } from "@/components/dashboard"
import ProtectedRoute from "@/components/auth/protected-route"

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  )
}
