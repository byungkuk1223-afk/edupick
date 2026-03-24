"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, Save, Sparkles, User } from "lucide-react";
import { Card } from "@/components/ui/Card";

// ── 상수 ──────────────────────────────────────────────────────────
const SCHOOL_TYPES = ["초등학교", "중학교", "고등학교", "성인·기타"] as const;

const GRADES: Record<(typeof SCHOOL_TYPES)[number], string[]> = {
  초등학교: ["1학년", "2학년", "3학년", "4학년", "5학년", "6학년"],
  중학교: ["1학년", "2학년", "3학년"],
  고등학교: ["1학년", "2학년", "3학년"],
  "성인·기타": ["해당 없음"],
};

const COURSES = ["일반", "심화", "영재", "예술", "체육", "직업·진로"] as const;

const INTEREST_SUBJECTS = [
  { group: "교과·언어", items: ["국어", "영어", "수학", "사회", "과학"] },
  { group: "제2외국어", items: ["중국어", "일본어", "스페인어"] },
  { group: "예술·창작", items: ["피아노·음악", "미술", "서예", "요리"] },
  { group: "체육·스포츠", items: ["축구", "농구", "태권도", "발레", "수영", "배드민턴"] },
  { group: "미래·기술", items: ["코딩", "AI·로봇", "논술·토론"] },
  { group: "보육·종합", items: ["보습학원", "방과후 교실"] },
] as const;

const GOALS = ["내신 성적 향상", "입시 준비", "취미·여가", "특기 개발", "진로 탐색", "체력 증진"] as const;

const STORAGE_KEY = "hakwonga_profile";

interface ProfileData {
  name: string;
  gender: "남" | "여" | "";
  birthYear: string;
  schoolName: string;
  schoolType: string;
  grade: string;
  course: string;
  interestSubjects: string[];
  goals: string[];
  region: string;
  memo: string;
}

const DEFAULT: ProfileData = {
  name: "",
  gender: "",
  birthYear: "",
  schoolName: "",
  schoolType: "",
  grade: "",
  course: "",
  interestSubjects: [],
  goals: [],
  region: "",
  memo: "",
};

function loadProfile(): ProfileData {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT, ...JSON.parse(raw) } : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

// ── 컴포넌트 ──────────────────────────────────────────────────────
export default function ProfilePage() {
  const [data, setData] = useState<ProfileData>(DEFAULT);
  const [saved, setSaved] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setData(loadProfile());
    setMounted(true);
  }, []);

  function set<K extends keyof ProfileData>(key: K, value: ProfileData[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function toggleList<K extends "interestSubjects" | "goals">(key: K, item: string) {
    setData((prev) => {
      const list = prev[key] as string[];
      return {
        ...prev,
        [key]: list.includes(item) ? list.filter((v) => v !== item) : [...list, item],
      };
    });
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const availableGrades = data.schoolType
    ? GRADES[data.schoolType as keyof typeof GRADES] ?? []
    : [];

  if (!mounted) {
    return (
      <div className="px-4 py-8">
        <div className="h-64 animate-pulse rounded-[28px] bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-10 pt-5">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/mypage"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-[0_10px_18px_rgba(195,200,220,0.14)]"
          aria-label="마이페이지로 돌아가기"
        >
          <ChevronLeft size={18} />
        </Link>
        <div>
          <h1 className="display-font text-xl font-bold tracking-[-0.04em] text-text-primary">
            내 학습 프로필
          </h1>
          <p className="text-xs text-text-secondary">입력한 정보를 바탕으로 맞춤 학원을 추천해 드립니다.</p>
        </div>
      </div>

      {/* 추천 안내 배너 */}
      <div className="mb-5 flex items-start gap-3 rounded-[18px] bg-gradient-to-br from-blue-50 to-sky-50 px-4 py-3.5">
        <Sparkles size={16} className="mt-0.5 shrink-0 text-primary" />
        <p className="text-xs leading-5 text-text-secondary">
          학교·학년·희망 수강 정보를 채울수록 <span className="font-semibold text-primary">AI 맞춤 추천</span> 정확도가 높아집니다.
        </p>
      </div>

      <div className="space-y-4">
        {/* 기본 정보 */}
        <Section title="기본 정보" icon={<User size={14} />}>
          <Label>이름 (본인 또는 자녀)</Label>
          <Input
            placeholder="홍길동"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
          />

          <Label className="mt-3">성별</Label>
          <div className="flex gap-2">
            {(["남", "여"] as const).map((g) => (
              <Chip
                key={g}
                selected={data.gender === g}
                onClick={() => set("gender", data.gender === g ? "" : g)}
              >
                {g}
              </Chip>
            ))}
          </div>

          <Label className="mt-3">출생 연도</Label>
          <Input
            placeholder="예: 2015"
            value={data.birthYear}
            maxLength={4}
            onChange={(e) => set("birthYear", e.target.value.replace(/\D/g, ""))}
          />
        </Section>

        {/* 학교 정보 */}
        <Section title="학교 정보">
          <Label>학교 구분</Label>
          <div className="flex flex-wrap gap-2">
            {SCHOOL_TYPES.map((t) => (
              <Chip
                key={t}
                selected={data.schoolType === t}
                onClick={() => {
                  set("schoolType", data.schoolType === t ? "" : t);
                  set("grade", "");
                }}
              >
                {t}
              </Chip>
            ))}
          </div>

          {data.schoolType && data.schoolType !== "성인·기타" && (
            <>
              <Label className="mt-3">학년</Label>
              <div className="flex flex-wrap gap-2">
                {availableGrades.map((g) => (
                  <Chip
                    key={g}
                    selected={data.grade === g}
                    onClick={() => set("grade", data.grade === g ? "" : g)}
                  >
                    {g}
                  </Chip>
                ))}
              </div>
            </>
          )}

          <Label className="mt-3">학교명 (선택)</Label>
          <Input
            placeholder="예: 서울초등학교"
            value={data.schoolName}
            onChange={(e) => set("schoolName", e.target.value)}
          />
        </Section>

        {/* 학습 과정 */}
        <Section title="학습 과정">
          <div className="flex flex-wrap gap-2">
            {COURSES.map((c) => (
              <Chip
                key={c}
                selected={data.course === c}
                onClick={() => set("course", data.course === c ? "" : c)}
              >
                {c}
              </Chip>
            ))}
          </div>
        </Section>

        {/* 희망 수강 */}
        <Section title="희망 수강 과목">
          <p className="mb-3 text-[11px] text-text-secondary">여러 개 선택 가능합니다.</p>
          <div className="space-y-3">
            {INTEREST_SUBJECTS.map((group) => (
              <div key={group.group}>
                <p className="mb-1.5 text-[11px] font-semibold text-text-secondary">{group.group}</p>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <Chip
                      key={item}
                      selected={data.interestSubjects.includes(item)}
                      onClick={() => toggleList("interestSubjects", item)}
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* 학습 목표 */}
        <Section title="학습 목표">
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <Chip
                key={g}
                selected={data.goals.includes(g)}
                onClick={() => toggleList("goals", g)}
              >
                {g}
              </Chip>
            ))}
          </div>
        </Section>

        {/* 관심 지역 */}
        <Section title="관심 지역">
          <Input
            placeholder="예: 서울 강남구, 경기 수원시"
            value={data.region}
            onChange={(e) => set("region", e.target.value)}
          />
        </Section>

        {/* 추가 메모 */}
        <Section title="추가 요청사항 (선택)">
          <textarea
            placeholder="예: 월·수·금 오후 3시 이후 가능, 여자 강사 선호 등"
            value={data.memo}
            onChange={(e) => set("memo", e.target.value)}
            rows={3}
            className="w-full rounded-[12px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none"
          />
        </Section>

        {/* 저장 버튼 */}
        <button
          type="button"
          onClick={handleSave}
          className="flex w-full items-center justify-center gap-2 rounded-[16px] bg-primary py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          {saved ? (
            <>저장됐어요 ✓</>
          ) : (
            <>
              <Save size={15} />
              프로필 저장
            </>
          )}
        </button>

        {data.interestSubjects.length > 0 && (
          <div className="rounded-[16px] bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold text-text-secondary">현재 선택한 희망 수강</p>
            <div className="flex flex-wrap gap-1.5">
              {data.interestSubjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-primary"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 공통 UI 조각 ─────────────────────────────────────────────────
function Section({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="mb-3 flex items-center gap-1.5">
        {icon && <span className="text-text-secondary">{icon}</span>}
        <h2 className="text-sm font-bold text-text-primary">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mb-1.5 text-xs font-semibold text-text-secondary ${className ?? ""}`}>
      {children}
    </p>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-[12px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary focus:outline-none"
    />
  );
}

function Chip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
        selected
          ? "bg-primary text-white"
          : "bg-slate-100 text-text-secondary hover:bg-slate-200"
      }`}
    >
      {children}
    </button>
  );
}
