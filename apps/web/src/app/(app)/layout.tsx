import { BottomNav } from "@/components/ui/BottomNav";
import { Sidebar } from "@/components/navigation/Sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {/* 데스크탑: 사이드바 레이아웃 */}
      <div className="hidden lg:flex lg:h-screen lg:overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 모바일: 기존 바텀 네비 */}
      <div className="lg:hidden">
        <main className="mx-auto max-w-lg pb-24">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
