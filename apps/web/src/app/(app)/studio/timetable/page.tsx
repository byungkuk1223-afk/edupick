"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { LoginRequiredCard } from "@/components/auth/LoginRequiredCard";
import { useProtectedPage } from "@/lib/use-protected-page";
import { isOperatorRole } from "@/lib/role-ui";
import { cn } from "@/lib/utils";

const DAYS = [
  { key: "MON", label: "월" },
  { key: "TUE", label: "화" },
  { key: "WED", label: "수" },
  { key: "THU", label: "목" },
  { key: "FRI", label: "금" },
  { key: "SAT", label: "토" },
  { key: "SUN", label: "일" },
] as const;

type DayKey = (typeof DAYS)[number]["key"];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00",
];

interface ClassSchedule {
  id: string;
  name: string;
  subject: string;
  monthlyFee: number;
  maxStudents: number;
  currentStudents: number;
  status: "OPEN" | "FULL" | "CLOSED";
  metrics: {
    activeEnrollmentCount: number;
    spotsLeft: number;
  };
  schedules: Array<{
    id: string;
    dayOfWeek: DayKey;
    startTime: string;
    endTime: string;
  }>;
}

const STATUS_CONFIG = {
  OPEN: {
    label: "개설중",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-400",
  },
  FULL: {
    label: "모집완료",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  CLOSED: {
    label: "모집종료",
    className: "bg-slate-100 text-slate-500 border-slate-200",
    dot: "bg-slate-400",
  },
} as const;

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function slotMatches(startTime: string, slot: string) {
  const slotMins = timeToMinutes(slot);
  const startMins = timeToMinutes(startTime);
  return startMins >= slotMins && startMins < slotMins + 60;
}

export default function TimetablePage() {
  const user = useAuth((state) => state.user);
  useProtectedPage();

  const { data: classes, isLoading } = useQuery<ClassSchedule[]>({
    queryKey: ["studio", "classes", "timetable"],
    queryFn: () => api.get("/class/mine"),
    enabled: !!user && isOperatorRole(user.role),
  });

  // day → slot → classes 맵 구성
  const grid = useMemo(() => {
    const map: Record<DayKey, Record<string, ClassSchedule[]>> = {
      MON: {}, TUE: {}, WED: {}, THU: {}, FRI: {}, SAT: {}, SUN: {},
    };
    if (!classes) return map;

    for (const cls of classes) {
      for (const sched of cls.schedules) {
        const day = sched.dayOfWeek;
        for (const slot of TIME_SLOTS) {
          if (slotMatches(sched.startTime, slot)) {
            if (!map[day][slot]) map[day][slot] = [];
            map[day][slot].push(cls);
          }
        }
      }
    }
    return map;
  }, [classes]);

  if (!user) {
    return (
      <div className="p-6">
        <LoginRequiredCard message="학원 계정으로 로그인하면 시간표를 볼 수 있어요." />
      </div>
    );
  }

  const today = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][new Date().getDay()] as DayKey;

  return (
    <div className="p-5 lg:p-7">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-text-secondary">STUDIO</p>
          <h1 className="display-font mt-1 text-2xl font-bold tracking-[-0.05em] text-text-primary">
            주간 시간표
          </h1>
        </div>
        <Link
          href="/studio/classes"
          className="flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(245,158,11,0.32)] transition-transform hover:-translate-y-0.5"
        >
          <Plus size={16} />
          수업 개설
        </Link>
      </div>

      {/* 범례 */}
      <div className="mt-4 flex flex-wrap gap-3">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <span key={key} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span className={cn("h-2 w-2 rounded-full", cfg.dot)} />
            {cfg.label}
          </span>
        ))}
      </div>

      {/* 시간표 그리드 */}
      <div className="mt-5 overflow-x-auto rounded-[20px] border border-slate-100 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)]">
        <table className="w-full min-w-[700px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="w-16 py-3 text-center text-xs font-semibold text-text-secondary">
                시간
              </th>
              {DAYS.map((day) => (
                <th
                  key={day.key}
                  className={cn(
                    "py-3 text-center text-xs font-semibold",
                    day.key === today
                      ? "text-amber-600"
                      : "text-text-secondary"
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                      day.key === today ? "bg-amber-100 text-amber-700" : ""
                    )}
                  >
                    {day.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map((slot) => (
              <tr key={slot} className="border-b border-slate-50 last:border-0">
                <td className="py-2 text-center text-[11px] font-medium text-text-secondary/70">
                  {slot}
                </td>
                {DAYS.map((day) => {
                  const items = grid[day.key][slot] ?? [];
                  return (
                    <td key={day.key} className="px-1 py-1 align-top">
                      {items.map((cls) => {
                        const cfg = STATUS_CONFIG[cls.status];
                        const enrolled = cls.metrics.activeEnrollmentCount;
                        return (
                          <Link
                            key={cls.id}
                            href={`/studio/classes`}
                            className={cn(
                              "mb-1 block rounded-[12px] border px-2.5 py-2 transition-opacity hover:opacity-80",
                              cfg.className
                            )}
                          >
                            <p className="truncate text-xs font-semibold leading-tight">
                              {cls.name}
                            </p>
                            <div className="mt-1 flex items-center justify-between gap-1">
                              <span className="text-[10px] opacity-80">
                                {enrolled}/{cls.maxStudents}명
                              </span>
                              <span className="flex items-center gap-1 text-[10px] font-semibold">
                                <span className={cn("h-1.5 w-1.5 rounded-full", cfg.dot)} />
                                {cfg.label}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && (!classes || classes.length === 0) && (
          <div className="py-16 text-center">
            <p className="text-sm text-text-secondary">등록된 수업이 없어요.</p>
            <Link
              href="/studio/classes"
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600"
            >
              <Plus size={14} />
              첫 수업 개설하기
            </Link>
          </div>
        )}
      </div>

      {/* 요약 카드 */}
      {classes && classes.length > 0 && (
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="전체 수업"
            value={`${classes.length}개`}
            sub="이번 주 개설 수업"
          />
          <SummaryCard
            label="총 수강 원생"
            value={`${classes.reduce((s, c) => s + c.metrics.activeEnrollmentCount, 0)}명`}
            sub="현재 등록 인원"
          />
          <SummaryCard
            label="모집 중"
            value={`${classes.filter((c) => c.status === "OPEN").length}개`}
            sub="신청 받는 수업"
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-[18px] border border-slate-100 bg-white p-4 shadow-[0_4px_12px_rgba(15,23,42,0.05)]">
      <p className="text-xs font-semibold tracking-[0.12em] text-text-secondary">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-text-primary">{value}</p>
      <p className="mt-1 text-xs text-text-secondary">{sub}</p>
    </div>
  );
}
