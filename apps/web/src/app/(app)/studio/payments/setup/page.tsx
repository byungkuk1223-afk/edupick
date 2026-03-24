"use client";

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BadgeCheck,
  Banknote,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronRight,
  Copy,
  CreditCard,
  Link2,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { LoginRequiredCard } from "@/components/auth/LoginRequiredCard";
import { useProtectedPage } from "@/lib/use-protected-page";
import { isOperatorRole } from "@/lib/role-ui";
import { cn } from "@/lib/utils";

interface PaymentSetup {
  id?: string;
  academyId: string;
  academyName: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  billingDay: number;
  acceptCard: boolean;
  acceptTransfer: boolean;
  acceptLocalCurrency: boolean;
  paymentLink?: string;
}

interface OwnedAcademy {
  id: string;
  name: string;
  address: string;
}

const BANKS = [
  "국민은행", "신한은행", "우리은행", "하나은행", "농협은행",
  "기업은행", "카카오뱅크", "토스뱅크", "SC제일은행", "씨티은행",
  "케이뱅크", "새마을금고", "신협", "우체국", "기타",
];

const BILLING_DAYS = [1, 5, 10, 15, 20, 25];

const PAYMENT_METHODS = [
  {
    key: "acceptTransfer" as const,
    icon: Banknote,
    label: "계좌이체",
    desc: "부모님이 등록 계좌로 직접 이체",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    key: "acceptCard" as const,
    icon: CreditCard,
    label: "카드결제",
    desc: "앱 내 카드 간편 결제",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    key: "acceptLocalCurrency" as const,
    icon: Wallet,
    label: "지역화폐",
    desc: "지역사랑상품권·페이 결제",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
];

function copyToClipboard(text: string) {
  void navigator.clipboard.writeText(text);
}

export default function PaymentSetupPage() {
  const user = useAuth((state) => state.user);
  useProtectedPage();

  const queryClient = useQueryClient();
  const [selectedAcademyId, setSelectedAcademyId] = useState<string>("");
  const [saved, setSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [form, setForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    billingDay: 10,
    acceptCard: true,
    acceptTransfer: true,
    acceptLocalCurrency: false,
  });

  const { data: academies } = useQuery<OwnedAcademy[]>({
    queryKey: ["studio", "academies"],
    queryFn: () => api.get("/academy/mine"),
    enabled: !!user && isOperatorRole(user?.role),
  });

  const { data: setup, refetch } = useQuery<PaymentSetup | null>({
    queryKey: ["studio", "payment-setup", selectedAcademyId],
    queryFn: () =>
      selectedAcademyId
        ? api.get(`/payment/setup/${selectedAcademyId}`)
        : null,
    enabled: !!selectedAcademyId,
  });

  // setup 데이터 로드되면 폼에 반영
  useState(() => {
    if (setup) {
      setForm({
        bankName: setup.bankName,
        accountNumber: setup.accountNumber,
        accountHolder: setup.accountHolder,
        billingDay: setup.billingDay,
        acceptCard: setup.acceptCard,
        acceptTransfer: setup.acceptTransfer,
        acceptLocalCurrency: setup.acceptLocalCurrency,
      });
    }
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      api.post(`/payment/setup/${selectedAcademyId}`, { ...form }),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      void queryClient.invalidateQueries({
        queryKey: ["studio", "payment-setup", selectedAcademyId],
      });
    },
  });

  const generateLinkMutation = useMutation({
    mutationFn: () =>
      api.post(`/payment/setup/${selectedAcademyId}/link`),
    onSuccess: () => {
      void refetch();
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    saveMutation.mutate();
  }

  function handleCopyLink() {
    if (setup?.paymentLink) {
      copyToClipboard(setup.paymentLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  }

  if (!user) {
    return (
      <div className="p-6">
        <LoginRequiredCard message="학원 계정으로 로그인하세요." />
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-7">
      {/* 헤더 */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-text-secondary">STUDIO · 수납</p>
        <h1 className="display-font mt-1 text-2xl font-bold tracking-[-0.05em] text-text-primary">
          결제 수납 설정
        </h1>
        <p className="mt-1 text-sm text-text-secondary">
          학원별 수납 계좌, 결제 방법, 청구일을 설정하고 부모님께 결제 링크를 공유하세요.
        </p>
      </div>

      {/* 학원 선택 */}
      <Card className="mb-5 p-5">
        <div className="flex items-center gap-2 text-text-secondary">
          <Building2 size={16} />
          <p className="text-xs font-semibold tracking-[0.14em]">학원 선택</p>
        </div>
        {!academies || academies.length === 0 ? (
          <p className="mt-3 text-sm text-text-secondary">
            등록된 학원이 없어요.{" "}
            <a href="/studio/academies" className="font-semibold text-primary">
              학원 등록하기 →
            </a>
          </p>
        ) : (
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {academies.map((ac) => (
              <button
                key={ac.id}
                type="button"
                onClick={() => setSelectedAcademyId(ac.id)}
                className={cn(
                  "flex items-start gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors",
                  selectedAcademyId === ac.id
                    ? "border-primary bg-blue-50"
                    : "border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                    selectedAcademyId === ac.id
                      ? "bg-primary text-white"
                      : "bg-slate-100 text-text-secondary"
                  )}
                >
                  {ac.name.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{ac.name}</p>
                  <p className="flex items-center gap-1 text-xs text-text-secondary">
                    <MapPin size={11} />
                    {ac.address}
                  </p>
                </div>
                {selectedAcademyId === ac.id && (
                  <CheckCircle2 size={16} className="ml-auto shrink-0 text-primary" />
                )}
              </button>
            ))}
          </div>
        )}
      </Card>

      {selectedAcademyId && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 수납 계좌 */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <Banknote size={16} />
              <p className="text-xs font-semibold tracking-[0.14em]">수납 계좌 정보</p>
            </div>
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary">은행</label>
                <select
                  value={form.bankName}
                  onChange={(e) => setForm((f) => ({ ...f, bankName: e.target.value }))}
                  className="mt-1.5 w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                >
                  <option value="">은행 선택</option>
                  {BANKS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">계좌번호</label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm((f) => ({ ...f, accountNumber: e.target.value }))}
                  placeholder="000-0000-0000-00"
                  className="mt-1.5 w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary">예금주</label>
                <input
                  type="text"
                  value={form.accountHolder}
                  onChange={(e) => setForm((f) => ({ ...f, accountHolder: e.target.value }))}
                  placeholder="예금주명"
                  className="mt-1.5 w-full rounded-[14px] border border-slate-200 bg-white px-3 py-2.5 text-sm text-text-primary outline-none focus:border-primary"
                />
              </div>
            </div>
          </Card>

          {/* 청구일 */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <CalendarClock size={16} />
              <p className="text-xs font-semibold tracking-[0.14em]">월 청구일</p>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              매월 이 날짜에 원비 청구 알림이 부모님께 발송됩니다.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {BILLING_DAYS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, billingDay: day }))}
                  className={cn(
                    "h-10 w-10 rounded-full text-sm font-semibold transition-colors",
                    form.billingDay === day
                      ? "bg-primary text-white shadow-[0_4px_12px_rgba(49,130,246,0.32)]"
                      : "bg-slate-100 text-text-secondary hover:bg-slate-200"
                  )}
                >
                  {day}일
                </button>
              ))}
            </div>
          </Card>

          {/* 결제 방법 */}
          <Card className="p-5">
            <div className="flex items-center gap-2 text-text-secondary">
              <ShieldCheck size={16} />
              <p className="text-xs font-semibold tracking-[0.14em]">허용 결제 방법</p>
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              부모님이 사용할 수 있는 결제 수단을 선택하세요.
            </p>
            <div className="mt-3 space-y-2">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const checked = form[method.key];
                return (
                  <button
                    key={method.key}
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, [method.key]: !f[method.key] }))
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-[16px] border px-4 py-3 text-left transition-colors",
                      checked
                        ? "border-primary/30 bg-blue-50"
                        : "border-slate-100 bg-white hover:bg-slate-50"
                    )}
                  >
                    <span className={cn("rounded-[10px] p-2", method.bg)}>
                      <Icon size={16} className={method.color} />
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text-primary">{method.label}</p>
                      <p className="text-xs text-text-secondary">{method.desc}</p>
                    </div>
                    <span
                      className={cn(
                        "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                        checked
                          ? "border-primary bg-primary"
                          : "border-slate-300 bg-white"
                      )}
                    >
                      {checked && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* 저장 버튼 */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? (
              "저장 중..."
            ) : saved ? (
              <span className="flex items-center gap-2">
                <BadgeCheck size={18} /> 저장 완료
              </span>
            ) : (
              "수납 설정 저장"
            )}
          </Button>
        </form>
      )}

      {/* 결제 링크 섹션 */}
      {selectedAcademyId && (
        <Card className="mt-5 p-5">
          <div className="flex items-center gap-2 text-text-secondary">
            <Link2 size={16} />
            <p className="text-xs font-semibold tracking-[0.14em]">원비 결제 링크</p>
          </div>
          <p className="mt-1 text-xs text-text-secondary">
            부모님께 공유하면 바로 결제 페이지로 이동합니다.
          </p>

          {setup?.paymentLink ? (
            <div className="mt-3">
              <div className="flex items-center gap-2 rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2.5">
                <p className="flex-1 truncate text-xs text-text-secondary">
                  {setup.paymentLink}
                </p>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="shrink-0 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-sm transition-colors hover:bg-blue-50"
                >
                  {copiedLink ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} /> 복사됨
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Copy size={12} /> 복사
                    </span>
                  )}
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`원비 결제 링크: ${setup.paymentLink}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-[14px] bg-[#25D366] py-2.5 text-center text-xs font-semibold text-white"
                >
                  카카오·문자로 공유
                </a>
                <button
                  type="button"
                  onClick={() => generateLinkMutation.mutate()}
                  className="flex items-center gap-1.5 rounded-[14px] border border-slate-200 px-3 py-2.5 text-xs font-semibold text-text-secondary hover:bg-slate-50"
                >
                  <RefreshCw size={13} />
                  링크 재발급
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-sm text-text-secondary">
                수납 설정을 저장하면 결제 링크를 생성할 수 있어요.
              </p>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 gap-1.5 text-primary"
                disabled={!setup || generateLinkMutation.isPending}
                onClick={() => generateLinkMutation.mutate()}
              >
                <Link2 size={14} />
                결제 링크 생성
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* 안내 */}
      <div className="mt-5 rounded-[16px] bg-slate-50 px-4 py-4">
        <p className="flex items-center gap-2 text-xs font-semibold text-text-secondary">
          <ShieldCheck size={14} className="text-emerald-500" />
          안전한 결제 처리
        </p>
        <p className="mt-1.5 text-xs leading-6 text-text-secondary">
          계좌 정보는 암호화되어 저장됩니다. 결제 링크는 학원별로 고유하게 생성되며, 언제든 재발급할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
