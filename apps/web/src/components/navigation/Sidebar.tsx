"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Baby,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Cog,
  CreditCard,
  Globe,
  GraduationCap,
  Home,
  Laptop,
  LayoutDashboard,
  Map,
  MessageSquare,
  Palette,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { isOperatorRole } from "@/lib/role-ui";
import { cn } from "@/lib/utils";

const academyCategories = [
  {
    id: "sports",
    label: "체육·스포츠",
    icon: Trophy,
    color: "text-orange-500",
    bg: "bg-orange-50",
    items: ["축구", "농구", "태권도", "발레", "수영", "배드민턴", "줄넘기"],
  },
  {
    id: "arts",
    label: "예술·창작",
    icon: Palette,
    color: "text-pink-500",
    bg: "bg-pink-50",
    items: ["피아노·음악", "미술", "서예", "요리"],
  },
  {
    id: "tech",
    label: "미래·기술",
    icon: Laptop,
    color: "text-violet-500",
    bg: "bg-violet-50",
    items: ["코딩", "AI·로봇", "논술·토론"],
  },
  {
    id: "subject",
    label: "교과·언어",
    icon: BookOpen,
    color: "text-blue-500",
    bg: "bg-blue-50",
    items: ["국어", "영어", "수학", "사회", "과학"],
  },
  {
    id: "foreign",
    label: "제2외국어",
    icon: Globe,
    color: "text-teal-500",
    bg: "bg-teal-50",
    items: ["중국어", "일본어", "스페인어", "기타 외국어"],
  },
  {
    id: "care",
    label: "보육·종합",
    icon: Baby,
    color: "text-amber-500",
    bg: "bg-amber-50",
    items: ["보습학원", "방과후 교실", "유치원·어린이집"],
  },
] as const;

const operatorNav = [
  { href: "/studio", label: "스튜디오", icon: LayoutDashboard },
  { href: "/studio/classes", label: "반 관리", icon: GraduationCap },
  { href: "/studio/students", label: "원생 관리", icon: Users },
  { href: "/studio/payments", label: "수납 관리", icon: CreditCard },
  { href: "/studio/announcements", label: "공지 발송", icon: MessageSquare },
  { href: "/mypage/settings", label: "설정", icon: Cog },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const user = useAuth((state) => state.user);
  const isOperator = isOperatorRole(user?.role);
  const [academyOpen, setAcademyOpen] = useState(
    pathname.startsWith("/discover")
  );

  if (isOperator) {
    return (
      <SidebarShell>
        <SidebarBrand />
        <nav className="mt-6 space-y-1 px-3">
          {operatorNav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-blue-50 text-primary"
                    : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                )}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <SidebarUser />
      </SidebarShell>
    );
  }

  return (
    <SidebarShell>
      <SidebarBrand />
      <nav className="mt-6 space-y-1 px-3">
        {/* 홈 */}
        <SidebarLink href="/home" icon={Home} label="홈" pathname={pathname} />

        {/* 학원 탐색 - 아코디언 */}
        <div>
          <button
            type="button"
            onClick={() => setAcademyOpen((v) => !v)}
            className={cn(
              "flex w-full items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors",
              pathname.startsWith("/discover")
                ? "bg-blue-50 text-primary"
                : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
            )}
          >
            <Map size={18} aria-hidden="true" />
            <span className="flex-1 text-left">학원 탐색</span>
            {academyOpen ? (
              <ChevronDown size={15} className="shrink-0" />
            ) : (
              <ChevronRight size={15} className="shrink-0" />
            )}
          </button>

          {academyOpen && (
            <div className="mt-1 space-y-0.5 pl-3">
              <Link
                href="/discover"
                className={cn(
                  "flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-sm transition-colors",
                  pathname === "/discover"
                    ? "bg-blue-50 font-semibold text-primary"
                    : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                )}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                전체 보기
              </Link>

              {academyCategories.map((cat) => {
                const Icon = cat.icon;
                const href = `/discover?category=${cat.id}`;
                const active = pathname === "/discover" && false; // query param 기반
                return (
                  <Link
                    key={cat.id}
                    href={href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-[14px] px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-blue-50 font-semibold text-primary"
                        : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
                    )}
                  >
                    <span className={cn("rounded-lg p-1", cat.bg)}>
                      <Icon size={13} className={cat.color} aria-hidden="true" />
                    </span>
                    {cat.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 아이 스케줄 */}
        <SidebarLink href="/calendar" icon={GraduationCap} label="아이 스케줄" pathname={pathname} />

        {/* 원비 납부 */}
        <SidebarLink href="/mypage/payments" icon={CreditCard} label="원비 납부·관리" pathname={pathname} />

        {/* 성장 기록 */}
        <SidebarLink href="/mypage/report" icon={ShieldCheck} label="성장 기록" pathname={pathname} />

        {/* 커뮤니티 */}
        <SidebarLink href="/chat" icon={MessageSquare} label="커뮤니티" pathname={pathname} />

        <div className="!mt-4 border-t border-slate-100 pt-4">
          {/* 설정 */}
          <SidebarLink href="/mypage/settings" icon={Cog} label="설정" pathname={pathname} />
        </div>
      </nav>
      <SidebarUser />
    </SidebarShell>
  );
}

function SidebarLink({
  href,
  icon: Icon,
  label,
  pathname,
}: {
  href: string;
  icon: React.ComponentType<{ size?: number; "aria-hidden"?: boolean | "true" }>;
  label: string;
  pathname: string;
}) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-[16px] px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-blue-50 text-primary"
          : "text-text-secondary hover:bg-slate-50 hover:text-text-primary"
      )}
    >
      <Icon size={18} aria-hidden={true} />
      {label}
    </Link>
  );
}

function SidebarBrand() {
  return (
    <div className="px-5 pt-5">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-lg font-bold tracking-[-0.05em] text-text-primary">
          학원<span className="text-primary">가</span>
        </span>
      </Link>
    </div>
  );
}

function SidebarUser() {
  const user = useAuth((state) => state.user);
  if (!user) return null;

  return (
    <div className="mt-auto border-t border-slate-100 px-4 py-4">
      <Link
        href="/mypage"
        className="flex items-center gap-3 rounded-[16px] px-2 py-2 transition-colors hover:bg-slate-50"
      >
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-primary">
          {(user.name ?? "U").charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-text-primary">
            {user.name ?? "사용자"}
          </p>
          <p className="truncate text-xs text-text-secondary">{user.email ?? ""}</p>
        </div>
      </Link>
    </div>
  );
}

function SidebarShell({ children }: { children: React.ReactNode }) {
  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-slate-100 bg-white">
      {children}
    </aside>
  );
}
