"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarRange,
  ClipboardList,
  Cog,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const studioNav = [
  {
    section: "운영 현황",
    items: [
      { href: "/studio", label: "대시보드", icon: LayoutDashboard, exact: true },
      { href: "/studio/timetable", label: "주간 시간표", icon: CalendarRange },
    ],
  },
  {
    section: "학원 관리",
    items: [
      { href: "/studio/academies", label: "학원 등록·정보", icon: Building2 },
      { href: "/studio/classes", label: "수업·반 관리", icon: ClipboardList },
      { href: "/studio/students", label: "원생 관리", icon: UsersRound },
    ],
  },
  {
    section: "수납·정산",
    items: [
      { href: "/studio/payments", label: "원비 수납", icon: CreditCard },
      { href: "/studio/payments/reminders", label: "미납 알림", icon: Megaphone },
      { href: "/studio/statistics", label: "매출 통계", icon: BarChart3 },
    ],
  },
  {
    section: "소통",
    items: [
      { href: "/studio/announcements", label: "공지 발송", icon: Megaphone },
    ],
  },
] as const;

export function StudioSidebar() {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-100 bg-white">
      {/* 브랜드 */}
      <div className="px-5 pt-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-[-0.05em] text-text-primary">
            Edu<span className="text-primary">Pick</span>
          </span>
        </Link>
        <p className="mt-1 text-[11px] font-semibold tracking-[0.14em] text-text-secondary">
          STUDIO
        </p>
      </div>

      {/* 네비게이션 */}
      <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-4">
        {studioNav.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary/60">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  "exact" in item && item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-amber-50 text-amber-700"
                        : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                    )}
                  >
                    <Icon size={17} aria-hidden="true" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="border-t border-slate-100 pt-4">
          <Link
            href="/mypage/settings"
            className={cn(
              "flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/mypage/settings"
                ? "bg-amber-50 text-amber-700"
                : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
            )}
          >
            <Cog size={17} aria-hidden="true" />
            설정
          </Link>
        </div>
      </nav>

      {/* 유저 */}
      {user && (
        <div className="border-t border-slate-100 px-4 py-4">
          <Link
            href="/mypage"
            className="flex items-center gap-3 rounded-[16px] px-2 py-2 transition-colors hover:bg-slate-50"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">
              {(user.name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {user.name ?? "원장님"}
              </p>
              <p className="truncate text-xs text-text-secondary">{user.email ?? ""}</p>
            </div>
          </Link>
        </div>
      )}
    </aside>
  );
}
