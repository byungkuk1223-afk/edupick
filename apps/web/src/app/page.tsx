import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  CalendarDays,
  CreditCard,
  Search,
  Sparkles,
} from "lucide-react";
import {
  PublicHeader,
  type PublicHeaderNavItem,
} from "@/components/navigation/PublicHeader";
import { cn } from "@/lib/utils";
import characterDancer from "../../images/characters/edupick_character_1.png";
import characterSoccer from "../../images/characters/edupick_character_2.png";
import characterReader from "../../images/characters/edupick_character_3.png";
import characterMartial from "../../images/characters/edupick_character_4.png";
import characterTeacher from "../../images/characters/edupick_character_5.png";
import characterPainter from "../../images/characters/edupick_character_6.png";
import characterRunner from "../../images/characters/edupick_character_7.png";
import characterLaptop from "../../images/characters/edupick_character_8.png";

const introNavItems = [
  { href: "#why", label: "핵심 가치" },
  { href: "#flow", label: "이용 흐름" },
  { href: "#start", label: "시작하기" },
] satisfies readonly PublicHeaderNavItem[];

const heroHighlights = [
  {
    title: "탐색",
    description: "시간표, 셔틀, 비용을 먼저 확인합니다.",
  },
  {
    title: "신청",
    description: "고른 반 정보를 유지한 채 등록합니다.",
  },
  {
    title: "관리",
    description: "일정과 공지를 홈에서 다시 확인합니다.",
  },
] as const;

const coreBenefits = [
  {
    icon: Search,
    title: "비교 기준이 한눈에 보입니다",
    description:
      "거리만 보는 대신 시간표, 셔틀, 수강료를 먼저 읽고 아이 일정에 맞는 반만 빠르게 좁힐 수 있습니다.",
  },
  {
    icon: CreditCard,
    title: "신청 흐름이 끊기지 않습니다",
    description:
      "학원 상세에서 반을 다시 찾지 않아도 고른 반 정보와 비용이 그대로 이어져 결제 직전까지 맥락이 유지됩니다.",
  },
  {
    icon: CalendarDays,
    title: "등록 후 확인도 단순합니다",
    description:
      "오늘 수업, 결제 예정, 최근 공지를 홈에서 바로 보게 정리해 재방문 동선도 짧게 만들었습니다.",
  },
] satisfies readonly {
  icon: LucideIcon;
  title: string;
  description: string;
}[];

const journeyCards = [
  {
    id: "parent",
    label: "PARENT FLOW",
    title: "학부모는 필요한 정보만 빠르게 확인합니다",
    description:
      "소개 문구보다 실제 선택 흐름이 먼저 보이도록 정리했습니다. 아이에게 맞는 반을 찾고 바로 등록하는 데 집중합니다.",
    chips: ["/discover", "/signup", "/home"],
    steps: [
      "시간표와 셔틀이 맞는 반만 먼저 추립니다.",
      "고른 반 정보와 월 수강료를 그대로 유지한 채 신청합니다.",
      "등록 후에는 홈에서 일정, 결제, 공지를 함께 확인합니다.",
    ],
    ctaHref: "/discover",
    ctaLabel: "학원 둘러보기",
    chipTone: "bg-blue-50 text-primary",
    panelTone: "bg-[linear-gradient(180deg,#ffffff_0%,#edf6ff_100%)]",
    sprite: characterTeacher,
    spriteClassName: "bottom-[-28px] right-[-16px] w-[126px] sm:w-[148px]",
  },
  {
    id: "studio",
    label: "INSTRUCTOR FLOW",
    title: "강사와 원장은 넓은 화면에서 더 크게 관리합니다",
    description:
      "모바일에서는 빠르게 확인하고, PC에서는 반 운영과 수납 현황을 더 넓게 다룰 수 있도록 같은 구조로 연결했습니다.",
    chips: ["/instructor", "/studio", "/studio/payments"],
    steps: [
      "강사 전용 진입점에서 운영 화면으로 바로 이동합니다.",
      "반, 원생, 일정 상태를 스튜디오에서 한 번에 관리합니다.",
      "수납 현황과 공지를 같은 흐름 안에서 처리합니다.",
    ],
    ctaHref: "/instructor",
    ctaLabel: "강사 전용 보기",
    chipTone: "bg-amber-100 text-amber-900",
    panelTone: "bg-[linear-gradient(180deg,#fffaf2_0%,#ffefdd_100%)]",
    sprite: characterLaptop,
    spriteClassName:
      "bottom-[-24px] right-[-28px] w-[152px] sm:w-[174px]",
  },
] as const;

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

type CharacterSpriteProps = {
  src: StaticImageData;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

function CtaLink({
  href,
  children,
  variant = "primary",
  className,
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-base",
        variant === "primary" &&
          "bg-[linear-gradient(135deg,#4b97ff_0%,#3182f6_100%)] text-white shadow-[0_22px_44px_rgba(49,130,246,0.28)] hover:-translate-y-0.5",
        variant === "secondary" &&
          "border border-white/75 bg-white/88 text-text-primary shadow-[0_16px_32px_rgba(148,163,184,0.18)] hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" && "px-0 py-0 text-text-primary hover:text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}

function CharacterSprite({
  src,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 320px, 40vw",
}: CharacterSpriteProps) {
  return (
    <Image
      src={src}
      alt=""
      aria-hidden="true"
      priority={priority}
      sizes={sizes}
      draggable={false}
      className={cn("pointer-events-none absolute h-auto select-none", className)}
    />
  );
}

export default function HomePage() {
  return (
    <main
      id="main-content"
      className="relative overflow-hidden px-4 pb-20 pt-4 sm:px-6 sm:pb-24 lg:px-8"
    >
      <div className="mx-auto max-w-[1180px]">
        <PublicHeader
          navItems={introNavItems}
          subtitle="아이의 수업 탐색과 학원 운영을 더 간단하게"
        />

        <section className="relative mt-5 overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(180deg,#fbfdff_0%,#eef5ff_100%)] px-5 py-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:px-7 sm:py-8 lg:rounded-[44px] lg:px-12 lg:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_24%),radial-gradient(circle_at_85%_16%,rgba(90,166,255,0.24),transparent_18%),radial-gradient(circle_at_48%_74%,rgba(255,194,122,0.2),transparent_22%)]"
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-center lg:gap-10">
            <div className="max-w-[560px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/84 px-4 py-2 text-[11px] font-semibold tracking-[0.18em] text-text-secondary shadow-[0_14px_28px_rgba(148,163,184,0.14)]">
                <Sparkles size={14} className="text-primary" />
                MOBILE FIRST LANDING
              </span>

              <h1 className="display-font mt-5 text-[2.45rem] font-bold leading-[0.97] tracking-[-0.07em] text-text-primary sm:text-[3.4rem] lg:text-[4.25rem]">
                우리 아이에게 맞는 학원을
                <br />
                더 쉽게 찾고 바로 등록하세요.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-text-secondary sm:text-base sm:leading-8 lg:text-lg">
                EduPick은 학원 탐색, 신청, 일정 확인, 운영 관리를 하나의 흐름으로
                정리했습니다. 랜딩 페이지는 설명을 줄이고 핵심 행동만 남겨 모바일에서
                먼저 읽히고, PC에서는 더 넓게 관리할 수 있게 구성했습니다.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <CtaLink href="/signup">
                  학부모로 시작하기
                  <ArrowRight size={18} />
                </CtaLink>
                <CtaLink href="/instructor" variant="secondary">
                  강사 전용 보기
                </CtaLink>
              </div>

              <div className="mt-7 grid gap-3">
                {heroHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border border-white/75 bg-white/78 px-4 py-4 shadow-[0_14px_30px_rgba(148,163,184,0.12)] backdrop-blur-sm sm:px-5"
                  >
                    <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[420px] overflow-hidden rounded-[32px] border border-white/75 bg-[linear-gradient(180deg,#f8fbff_0%,#e8f2ff_100%)] px-4 py-5 shadow-[0_24px_60px_rgba(84,120,183,0.12)] sm:min-h-[480px] sm:px-6 sm:py-6 lg:min-h-[560px] lg:rounded-[40px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,255,255,0.94),transparent_20%),radial-gradient(circle_at_80%_18%,rgba(255,210,146,0.3),transparent_16%),linear-gradient(120deg,rgba(255,255,255,0.28),transparent_54%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-x-4 top-[32%] h-px bg-[linear-gradient(90deg,transparent,rgba(101,145,214,0.36),transparent)] sm:inset-x-6"
              />
              <div
                aria-hidden="true"
                className="absolute left-[12%] top-[16%] h-20 w-20 rounded-full bg-white/90 blur-2xl sm:h-24 sm:w-24"
              />
              <div
                aria-hidden="true"
                className="absolute right-[16%] top-[10%] h-20 w-20 rounded-full bg-[#ffd9a8]/55 blur-2xl sm:h-24 sm:w-24"
              />

              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-text-primary shadow-[0_12px_24px_rgba(148,163,184,0.16)] sm:left-6 sm:top-6">
                영어
              </div>
              <div className="absolute right-4 top-12 rounded-full bg-[#182235] px-3 py-1.5 text-[11px] font-semibold text-white shadow-[0_18px_32px_rgba(15,23,42,0.22)] sm:right-6">
                예체능
              </div>
              <div className="absolute left-6 top-[44%] rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-text-primary shadow-[0_12px_24px_rgba(148,163,184,0.14)]">
                미술
              </div>

              <CharacterSprite
                src={characterDancer}
                className="float-gentle left-[-8px] top-5 w-[132px] drop-shadow-[0_18px_28px_rgba(120,146,193,0.18)] sm:left-0 sm:w-[156px] lg:w-[184px]"
                priority
                sizes="(min-width: 1024px) 190px, 30vw"
              />
              <CharacterSprite
                src={characterReader}
                className="float-gentle-delayed right-[6px] top-8 w-[124px] drop-shadow-[0_18px_28px_rgba(120,146,193,0.18)] sm:right-2 sm:w-[148px] lg:w-[172px]"
                priority
                sizes="(min-width: 1024px) 180px, 28vw"
              />
              <CharacterSprite
                src={characterPainter}
                className="bottom-[16px] left-1/2 w-[210px] -translate-x-[52%] drop-shadow-[0_28px_40px_rgba(120,146,193,0.16)] sm:w-[245px] lg:w-[300px]"
                priority
                sizes="(min-width: 1024px) 260px, 42vw"
              />
              <CharacterSprite
                src={characterRunner}
                className="float-gentle-delayed bottom-[-18px] right-[8px] w-[104px] drop-shadow-[0_18px_28px_rgba(120,146,193,0.18)] sm:w-[122px] lg:w-[148px]"
                sizes="(min-width: 1024px) 140px, 20vw"
              />
              <CharacterSprite
                src={characterSoccer}
                className="float-gentle-slow left-[39%] top-[14%] w-[88px] drop-shadow-[0_18px_28px_rgba(120,146,193,0.16)] sm:w-[104px] lg:w-[124px]"
                sizes="(min-width: 1024px) 120px, 16vw"
              />

              <div className="absolute bottom-4 left-4 max-w-[220px] rounded-[28px] bg-[#16233a] px-4 py-4 text-white shadow-[0_24px_48px_rgba(15,23,42,0.24)] sm:bottom-6 sm:left-6 sm:max-w-[250px] sm:px-5">
                <p className="text-[11px] font-semibold tracking-[0.18em] text-white/60">
                  ONE FLOW
                </p>
                <p className="mt-2 text-base font-semibold leading-6 sm:text-lg">
                  탐색부터 일정 확인까지
                  <br />
                  끊기지 않는 구조
                </p>
                <p className="mt-2 text-xs leading-6 text-white/70 sm:text-sm">
                  모바일에서는 빠르게 읽히고, PC에서는 더 넓게 관리할 수 있게 같은
                  흐름으로 연결합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="why" className="mt-16 scroll-mt-28">
          <div className="max-w-[640px]">
            <p className="text-xs font-semibold tracking-[0.18em] text-text-secondary">
              WHY EDU PICK
            </p>
            <h2 className="display-font mt-3 text-3xl font-bold tracking-[-0.06em] text-text-primary sm:text-4xl">
              처음 이해해야 할 핵심은 세 가지면 충분합니다.
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base sm:leading-8">
              랜딩 페이지를 길게 설명하지 않고, 사용자가 실제로 궁금해하는 비교,
              신청, 등록 이후 관리 흐름만 남겼습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {coreBenefits.map((item) => {
              const Icon = item.icon;

              return (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-white/75 bg-white/86 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm sm:p-6"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-[18px] bg-[linear-gradient(180deg,#eef5ff_0%,#ffffff_100%)] text-primary shadow-[0_12px_24px_rgba(148,163,184,0.14)]">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-semibold tracking-[-0.04em] text-text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="flow" className="mt-16 scroll-mt-28">
          <div className="max-w-[680px]">
            <p className="text-xs font-semibold tracking-[0.18em] text-text-secondary">
              CLEAR ENTRY
            </p>
            <h2 className="display-font mt-3 text-3xl font-bold tracking-[-0.06em] text-text-primary sm:text-4xl">
              학부모와 강사 모두 진입점이 분명해야 합니다.
            </h2>
            <p className="mt-4 text-sm leading-7 text-text-secondary sm:text-base sm:leading-8">
              첫 방문자는 모바일에서 빠르게 이해하고, 운영자는 PC에서 더 큰 화면으로
              관리할 수 있도록 역할별 흐름을 나눴습니다.
            </p>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {journeyCards.map((card) => (
              <article
                key={card.id}
                className={cn(
                  "relative overflow-hidden rounded-[34px] border border-white/75 p-5 shadow-[0_20px_52px_rgba(15,23,42,0.08)] sm:p-6 lg:p-7",
                  card.panelTone
                )}
              >
                <div className="relative z-10 max-w-[430px] pr-16 sm:pr-24">
                  <span className="text-xs font-semibold tracking-[0.18em] text-text-secondary">
                    {card.label}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-text-primary">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-text-secondary sm:text-base">
                    {card.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {card.chips.map((chip) => (
                      <span
                        key={chip}
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-semibold",
                          card.chipTone
                        )}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>

                  <ol className="mt-6 space-y-3">
                    {card.steps.map((step, index) => (
                      <li
                        key={step}
                        className="flex items-start gap-3 rounded-[24px] border border-white/80 bg-white/78 px-4 py-4 shadow-[0_12px_26px_rgba(148,163,184,0.12)]"
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#192338] text-xs font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="text-sm leading-6 text-text-secondary">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-6">
                    <CtaLink href={card.ctaHref} variant="ghost" className="gap-2">
                      {card.ctaLabel}
                      <ArrowRight size={16} />
                    </CtaLink>
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.74),transparent_60%)]"
                />
                <CharacterSprite
                  src={card.sprite}
                  className={cn(
                    "float-gentle-slow drop-shadow-[0_16px_26px_rgba(120,146,193,0.14)]",
                    card.spriteClassName
                  )}
                  sizes="(min-width: 1024px) 180px, 20vw"
                />
              </article>
            ))}
          </div>
        </section>

        <section
          id="start"
          className="relative mt-16 overflow-hidden rounded-[36px] bg-[#121b2d] px-5 py-7 text-white shadow-[0_28px_72px_rgba(15,23,42,0.18)] sm:px-7 sm:py-8 lg:rounded-[40px] lg:px-10 lg:py-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(255,255,255,0.12),transparent_18%),radial-gradient(circle_at_86%_78%,rgba(78,156,255,0.22),transparent_22%)]"
          />
          <div className="relative max-w-[680px]">
            <p className="text-xs font-semibold tracking-[0.18em] text-white/60">
              START HERE
            </p>
            <h2 className="display-font mt-3 text-3xl font-bold tracking-[-0.06em] text-white sm:text-4xl">
              학원 찾기부터 운영 관리까지, 더 가볍게 시작하세요.
            </h2>
            <p className="mt-4 text-sm leading-7 text-white/72 sm:text-base sm:leading-8">
              모바일에서는 바로 행동하고, PC에서는 더 넓게 확인할 수 있도록 랜딩과
              제품 화면의 첫 인상을 정리했습니다.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <CtaLink href="/signup">
                학부모로 시작하기
                <ArrowRight size={18} />
              </CtaLink>
              <CtaLink
                href="/login"
                variant="secondary"
                className="border-white/16 bg-white/10 text-white hover:bg-white/16"
              >
                로그인
              </CtaLink>
            </div>
          </div>

          <CharacterSprite
            src={characterMartial}
            className="float-gentle-delayed bottom-[-48px] left-[-22px] w-[138px] opacity-90 drop-shadow-[0_18px_30px_rgba(24,35,56,0.34)] sm:w-[168px] lg:w-[192px]"
            sizes="(min-width: 1024px) 160px, 18vw"
          />
        </section>
      </div>
    </main>
  );
}
