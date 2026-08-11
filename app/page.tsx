import { AppShell } from "@/components/AppShell";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export default function Home() {
  return (
    <AppShell activePath="/">
      <DashboardPage />
    </AppShell>
  );
}
