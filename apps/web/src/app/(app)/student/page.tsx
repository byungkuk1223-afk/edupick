"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Heart,
  Send,
  Sparkles,
} from "lucide-react";
import { LoginRequiredCard } from "@/components/auth/LoginRequiredCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";

interface ScheduleItem {
  id: string;
  className: string;
  academyName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  color?: string;
}

interface WishItem {
  id: string;
  className: string;
  academyName: string;
  monthlyFee?: number;
  status: string;
}

const DAY_LABELS: Record<string, string> = {
  MON: "월",
  TUE: "화",
  WED: "수",
  THU: "목",
  FRI: "금",
  SAT: "토",
  SUN: "일",
};

export default function StudentHomePage() {
  const user = useAuth((state) => state.user);
  const [shareSuccess, setShareSuccess] = useState(false);

  const { data: schedule } = useQuery<ScheduleItem[]>({
    queryKey: ["student", "schedule"],
    queryFn: () => api.get("/calendar/student"),
    enabled: !!user,
  });

  const { data: wishes } = useQuery<WishItem[]>({
    queryKey: ["student", "wishes"],
    queryFn: () => api.get("/user/wishes"),
    enabled: !!user,
  });

  async function handleShareWishes() {
    try {
      await api.post("/user/wishes/share");
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3000);
    } catch {
      // 공유 실패 시 무시
    }
  }

  if (!user) {
    return (
      <div className="px-4 py-8">
        <LoginRequiredCard description="로그인하면 내 수업 일정과 위시리스트를 볼 수 있어요." />
      </div>
    );
  }

  const today = new Date();
  const todayKey = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][today.getDay()];
  const todaySchedule = schedule?.filter((s) => s.dayOfWeek === todayKey) ?? [];

  return (
    <div className="px-4 pb-24 pt-5">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-text-secondary">
              STUDENT HOME
            </p>
            <h1 className="display-font mt-1 text-2xl font-bold tracking-[-0.05em] text-text-primary">
              안녕하세요, {user.name ?? "학생"}님
            </h1>
          </div>
          <div className="rounded-full bg-emerald-50 p-3 text-emerald-500">
            <Sparkles size={18} />
          </div>
        </div>

        {/* 오늘 수업 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <CalendarDays size={16} />
            <p className="text-xs font-semibold tracking-[0.14em]">오늘 수업</p>
          </div>

          {todaySchedule.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">오늘은 수업이 없어요</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {todaySchedule.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-[18px] bg-emerald-50/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{item.className}</p>
                    <p className="text-xs text-text-secondary">{item.academyName}</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-600">
                    {item.startTime} – {item.endTime}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* 주간 일정 */}
        <Card className="p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <BookOpen size={16} />
            <p className="text-xs font-semibold tracking-[0.14em]">이번 주 수업</p>
          </div>

          {!schedule || schedule.length === 0 ? (
            <p className="mt-4 text-sm text-text-secondary">
              등록된 수업이 없어요. 부모님께 수업 등록을 요청해 보세요.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => {
                const dayItems = schedule.filter((s) => s.dayOfWeek === day);
                if (dayItems.length === 0) return null;
                return (
                  <div key={day} className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        day === todayKey
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-text-secondary"
                      }`}
                    >
                      {DAY_LABELS[day]}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {dayItems.map((item) => (
                        <span
                          key={item.id}
                          className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-text-primary shadow-sm"
                        >
                          {item.className} {item.startTime}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* 위시리스트 */}
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <Heart size={16} />
              <p className="text-xs font-semibold tracking-[0.14em]">내 위시리스트</p>
            </div>
            {wishes && wishes.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-xs text-primary"
                onClick={handleShareWishes}
              >
                <Send size={13} />
                {shareSuccess ? "공유 완료!" : "부모님께 공유"}
              </Button>
            )}
          </div>

          {!wishes || wishes.length === 0 ? (
            <div className="mt-4">
              <p className="text-sm text-text-secondary">
                담아둔 수업이 없어요.
              </p>
              <a
                href="/discover"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                학원 둘러보기 <ChevronRight size={14} />
              </a>
            </div>
          ) : (
            <ul className="mt-3 space-y-2">
              {wishes.map((wish) => (
                <li
                  key={wish.id}
                  className="flex items-center justify-between rounded-[18px] bg-rose-50/50 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-text-primary">{wish.className}</p>
                    <p className="text-xs text-text-secondary">{wish.academyName}</p>
                  </div>
                  {wish.monthlyFee && (
                    <span className="text-xs font-semibold text-rose-500">
                      월 {wish.monthlyFee.toLocaleString()}원
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
