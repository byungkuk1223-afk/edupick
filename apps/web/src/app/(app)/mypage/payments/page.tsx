"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  CreditCard,
  FileText,
  Printer,
  ReceiptText,
  X,
} from "lucide-react";
import { LoginRequiredCard } from "@/components/auth/LoginRequiredCard";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { FilterChip } from "@/components/ui/FilterChip";
import { api } from "@/lib/api";
import { useProtectedPage } from "@/lib/use-protected-page";

interface PaymentItem {
  id: string;
  enrollmentId: string;
  amount: number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  paidAt: string | null;
  createdAt: string;
  portonePaymentId: string | null;
  className: string;
  subject: string;
  academy: {
    id: string;
    name: string;
  };
  child: {
    id: string;
    name: string;
  } | null;
  effectiveDate: string;
}

const statusFilters = ["ALL", "COMPLETED", "PENDING", "REFUNDED"] as const;

const PAYMENT_METHODS = [
  { id: "bank", label: "계좌이체", desc: "가상계좌 또는 실시간 이체" },
  { id: "card", label: "카드결제", desc: "신용·체크카드" },
  { id: "local", label: "지역화폐", desc: "지역사랑상품권·페이" },
] as const;

function formatCurrency(amount: number) {
  return `${amount.toLocaleString()}원`;
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(dateString));
}

function getStatusBadge(status: PaymentItem["status"]) {
  switch (status) {
    case "COMPLETED":
      return { label: "결제 완료", variant: "verified" as const };
    case "PENDING":
      return { label: "입금 대기", variant: "new" as const };
    case "REFUNDED":
      return { label: "환불", variant: "popular" as const };
    default:
      return { label: "실패", variant: "default" as const };
  }
}

// ── 교육비 납입증명서 모달 ──────────────────────────────────────
function CertificateModal({
  payments,
  onClose,
}: {
  payments: PaymentItem[];
  onClose: () => void;
}) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);

  const years = Array.from({ length: 3 }, (_, i) => currentYear - i);

  const completed = payments.filter(
    (p) =>
      p.status === "COMPLETED" &&
      p.paidAt &&
      new Date(p.paidAt).getFullYear() === year
  );

  // 학원별 집계
  const byAcademy = completed.reduce<
    Record<string, { name: string; total: number; items: PaymentItem[] }>
  >((acc, p) => {
    if (!acc[p.academy.id]) {
      acc[p.academy.id] = { name: p.academy.name, total: 0, items: [] };
    }
    acc[p.academy.id].total += p.amount;
    acc[p.academy.id].items.push(p);
    return acc;
  }, {});

  const grandTotal = completed.reduce((s, p) => s + p.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg rounded-t-[28px] bg-white p-6 sm:rounded-[28px]">
        {/* 헤더 */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            <h2 className="text-base font-bold text-text-primary">
              교육비 납입증명서
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* 연도 선택 */}
        <div className="mb-4 flex gap-2">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                year === y
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-text-secondary hover:bg-slate-200"
              }`}
            >
              {y}년
            </button>
          ))}
        </div>

        {/* 내용 */}
        <div className="print-area rounded-[16px] border border-slate-100 bg-slate-50 p-4">
          <p className="mb-3 text-center text-xs text-text-secondary">
            {year}년 1월 1일 ~ {year}년 12월 31일
          </p>

          {Object.keys(byAcademy).length === 0 ? (
            <p className="py-6 text-center text-sm text-text-secondary">
              {year}년 완료된 납부 내역이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {Object.values(byAcademy).map((academy) => (
                <div key={academy.name}>
                  <div className="flex items-center justify-between text-sm font-semibold text-text-primary">
                    <span>{academy.name}</span>
                    <span>{formatCurrency(academy.total)}</span>
                  </div>
                  <div className="mt-1 space-y-0.5 pl-2">
                    {academy.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-xs text-text-secondary"
                      >
                        <span>
                          {item.className}
                          {item.child ? ` (${item.child.name})` : ""}
                        </span>
                        <span>
                          {item.paidAt ? formatDate(item.paidAt) : ""} ·{" "}
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between font-bold text-text-primary">
                  <span>합계</span>
                  <span className="text-primary">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={handlePrint}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Printer size={16} />
          인쇄하기
        </button>
        <p className="mt-2 text-center text-[11px] text-text-secondary">
          연말정산 의료비·교육비 공제용으로 사용하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}

// ── 결제 방법 선택 모달 ──────────────────────────────────────────
function PaymentMethodModal({
  payment,
  onClose,
}: {
  payment: PaymentItem;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handlePay = () => {
    if (!selected) return;
    // TODO: 실제 결제 연동 (portone 등)
    alert(`${PAYMENT_METHODS.find((m) => m.id === selected)?.label}으로 결제를 진행합니다.\n(결제 모듈 연동 예정)`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-lg rounded-t-[28px] bg-white p-6 sm:rounded-[28px]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-text-primary">결제 방법 선택</h2>
            <p className="mt-0.5 text-xs text-text-secondary">
              {payment.className} · {formatCurrency(payment.amount)}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {PAYMENT_METHODS.map((method) => (
            <button
              key={method.id}
              type="button"
              onClick={() => setSelected(method.id)}
              className={`flex w-full items-center gap-4 rounded-[16px] border-2 p-4 text-left transition-colors ${
                selected === method.id
                  ? "border-primary bg-blue-50"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  selected === method.id ? "bg-primary/10" : "bg-slate-100"
                }`}
              >
                <CreditCard
                  size={18}
                  className={selected === method.id ? "text-primary" : "text-text-secondary"}
                />
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    selected === method.id ? "text-primary" : "text-text-primary"
                  }`}
                >
                  {method.label}
                </p>
                <p className="text-xs text-text-secondary">{method.desc}</p>
              </div>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handlePay}
          disabled={!selected}
          className="mt-4 w-full rounded-[14px] bg-primary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {formatCurrency(payment.amount)} 결제하기
        </button>
      </div>
    </div>
  );
}

// ── 메인 페이지 ──────────────────────────────────────────────────
export default function PaymentsPage() {
  const { mounted, canUseProtectedApi } = useProtectedPage();
  const [selectedStatus, setSelectedStatus] = useState<(typeof statusFilters)[number]>("ALL");
  const [showCertificate, setShowCertificate] = useState(false);
  const [payingItem, setPayingItem] = useState<PaymentItem | null>(null);

  const paymentsQuery = useQuery({
    queryKey: ["my-payments"],
    queryFn: () => api.get<PaymentItem[]>("/payments"),
    enabled: canUseProtectedApi,
  });

  const filteredPayments = useMemo(() => {
    const payments = paymentsQuery.data ?? [];
    if (selectedStatus === "ALL") return payments;
    return payments.filter((p) => p.status === selectedStatus);
  }, [paymentsQuery.data, selectedStatus]);

  if (!mounted) {
    return (
      <div className="px-4 py-8">
        <div className="soft-card h-56 animate-pulse rounded-[34px]" />
      </div>
    );
  }

  if (!canUseProtectedApi) {
    return (
      <div className="px-4 py-8">
        <LoginRequiredCard description="결제 상태와 최근 납부 내역을 확인하려면 로그인해 주세요." />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-8 pt-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Link
            href="/mypage"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-[0_10px_18px_rgba(195,200,220,0.14)]"
            aria-label="마이페이지로 돌아가기"
          >
            <ChevronLeft size={18} />
          </Link>
          <div>
            <h1 className="display-font text-xl font-bold tracking-[-0.04em] text-text-primary">
              원비 납부·관리
            </h1>
            <p className="text-xs text-text-secondary">최근 납부 상태와 반별 결제를 확인합니다.</p>
          </div>
        </div>

        {/* 납입증명서 버튼 */}
        <button
          type="button"
          onClick={() => setShowCertificate(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-[12px] bg-slate-100 px-3 py-2 text-xs font-semibold text-text-secondary transition-colors hover:bg-slate-200"
        >
          <FileText size={13} />
          납입증명서
        </button>
      </div>

      {/* 필터 */}
      <div className="mt-4 flex flex-wrap gap-2">
        {statusFilters.map((status) => (
          <FilterChip
            key={status}
            selected={selectedStatus === status}
            onClick={() => setSelectedStatus(status)}
          >
            {status === "ALL"
              ? "전체"
              : status === "COMPLETED"
                ? "완료"
                : status === "PENDING"
                  ? "대기"
                  : "환불"}
          </FilterChip>
        ))}
      </div>

      {/* 결제 목록 */}
      <div className="mt-4 space-y-3">
        {filteredPayments.length === 0 ? (
          <Card className="px-4 py-12 text-center text-sm text-text-secondary">
            조건에 맞는 결제 내역이 없습니다.
          </Card>
        ) : (
          filteredPayments.map((payment) => {
            const badge = getStatusBadge(payment.status);
            return (
              <Card key={payment.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-base font-semibold text-text-primary">
                        {payment.className}
                      </h2>
                      <Badge>{payment.subject}</Badge>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>

                    <div className="mt-3 space-y-1.5 text-xs text-text-secondary">
                      <p className="flex items-center gap-1.5">
                        <ReceiptText size={12} />
                        {payment.academy.name}
                        {payment.child ? ` · ${payment.child.name}` : ""}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <CreditCard size={12} />
                        {formatDate(payment.effectiveDate)} ·{" "}
                        {formatCurrency(payment.amount)}
                      </p>
                      {payment.portonePaymentId ? (
                        <p>결제 식별자: {payment.portonePaymentId}</p>
                      ) : null}
                    </div>

                    {/* PENDING → 결제 방법 선택 버튼 */}
                    {payment.status === "PENDING" && (
                      <button
                        type="button"
                        onClick={() => setPayingItem(payment)}
                        className="mt-3 flex items-center gap-1.5 rounded-[10px] bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        <CreditCard size={12} />
                        결제 방법 선택
                      </button>
                    )}
                  </div>

                  <p className="shrink-0 text-sm font-bold text-primary">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* 모달 */}
      {showCertificate && (
        <CertificateModal
          payments={paymentsQuery.data ?? []}
          onClose={() => setShowCertificate(false)}
        />
      )}
      {payingItem && (
        <PaymentMethodModal
          payment={payingItem}
          onClose={() => setPayingItem(null)}
        />
      )}
    </div>
  );
}
