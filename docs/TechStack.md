# 에듀픽(EduPick) 기술 스택 (Tech Stack)

**작성일**: 2026-03-11

---

## 1. 전체 아키텍처 원칙

1. **MVP 속도 우선**: 초기에는 단일 팀이 빠르게 반복할 수 있는 스택
2. **확장성 확보**: MAU 10만까지는 수직 확장, 이후 수평 확장
3. **운영 비용 최소화**: 서버리스·관리형 서비스 최대 활용
4. **한국 시장 특화**: 카카오 API, 국내 PG사 연동

---

## 2. 프론트엔드

### 2.1 모바일 앱

| 항목 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **React Native (Expo)** | iOS/Android 동시 개발, 빠른 MVP |
| 상태 관리 | **Zustand** | 경량, 보일러플레이트 최소 |
| 네비게이션 | **React Navigation v6** | 표준, 안정적 |
| 지도 | **React Native Maps** + **Naver Maps SDK** | 한국 로컬 지도 정확도 |
| 캘린더 | **react-native-calendars** | 커스터마이징 용이 |
| 결제 | **포트원(Port One) SDK** | 국내 PG 통합 (카카오·네이버·토스) |
| 푸시 알림 | **Expo Notifications** + **FCM** | 통합 관리 |

### 2.2 웹 (PWA)

| 항목 | 선택 | 근거 |
|---|---|---|
| 프레임워크 | **Next.js 15 (App Router)** | SSR/SSG, PWA 지원, SEO |
| 스타일링 | **Tailwind CSS** | 빠른 개발, 일관성 |
| 컴포넌트 | **shadcn/ui** | 접근성 기본 내장 |
| 상태 관리 | **TanStack Query** | 서버 상태 캐싱 |
| 지도 | **Naver Maps JavaScript API** | |

---

## 3. 백엔드

### 3.1 API 서버

| 항목 | 선택 | 근거 |
|---|---|---|
| 런타임 | **Node.js 22 LTS** | 팀 친숙도, 생태계 |
| 프레임워크 | **NestJS** | 구조화, DI, 마이크로서비스 전환 용이 |
| 언어 | **TypeScript** | 타입 안전성 |
| ORM | **Prisma** | 타입 안전 쿼리, 마이그레이션 |
| 실시간 | **Socket.io** | 셔틀 알림, 펀딩 업데이트 |
| 작업 큐 | **BullMQ** (Redis 기반) | 알림 발송, 결제 처리 비동기화 |
| 검색 | **Elasticsearch** | 학원 전문 검색, 지역 필터 |

### 3.2 초기 아키텍처 (모놀리식 → 점진적 분리)

```
Phase 1: 모놀리식 NestJS
  - 단일 코드베이스, 모듈 분리
  - auth, classes, schedule, payment, notification, community 모듈

Phase 2: 서비스 분리
  - Notification Service 분리 (알림톡 트래픽 격리)
  - Payment Service 분리 (PCI DSS 준수)

Phase 3: 완전 마이크로서비스 (필요 시)
```

---

## 4. 데이터베이스

| 용도 | 기술 | 버전 |
|---|---|---|
| 주 데이터베이스 | **PostgreSQL** | 16 |
| 캐시 / 세션 | **Redis** | 7 (ElastiCache) |
| 검색 | **Elasticsearch** | 8.x |
| 미디어 저장 | **AWS S3** | - |
| CDN | **AWS CloudFront** | - |

### 주요 DB 설계 포인트

```sql
-- 핵심 테이블 구조 (요약)
users           -- 학부모, 강사, 성인 수강생 통합
children        -- 자녀 프로필 (학부모 연결)
instructors     -- 강사 프로필
classes         -- 학원/수업 정보
schedules       -- 수업 시간표 (반복 일정)
enrollments     -- 수강 신청/등록
payments        -- 결제 내역
shuttle_routes  -- 셔틀 노선
shuttle_stops   -- 셔틀 정류장
notifications   -- 알림 발송 이력
reviews         -- 인증 리뷰 (receipt_verified boolean)
funding_classes -- 수업 개설 펀딩
family_links    -- 가족 계정 연결
```

---

## 5. 인프라 (AWS 기반)

```
┌─────────────────────────────────────────────────┐
│                   AWS 리전: ap-northeast-2 (서울) │
│                                                  │
│  Route53 → CloudFront → ALB                      │
│                          ↓                       │
│              ECS (Fargate) — API 서버             │
│                          ↓                       │
│  RDS PostgreSQL    ElastiCache Redis              │
│  (Multi-AZ)        (Cluster)                     │
│                                                  │
│  S3 (미디어)    SES (이메일)    SNS (푸시)        │
└─────────────────────────────────────────────────┘
```

### 비용 예측 (MVP ~ 초기)

| 서비스 | 월 비용 |
|---|---|
| ECS Fargate (2 task) | ~$80 |
| RDS db.t3.medium | ~$60 |
| ElastiCache t3.micro | ~$20 |
| S3 + CloudFront | ~$20 |
| 기타 (ALB, Route53, SNS) | ~$30 |
| **합계** | **~$210/월** |

---

## 6. 외부 API 연동

| 연동 서비스 | 용도 | 비고 |
|---|---|---|
| **카카오 알림톡 API** | 공지·결제 알림 비앱 수신 | 건당 약 8~15원 |
| **카카오 소셜 로그인** | 간편 가입 | 무료 |
| **네이버 지도 API** | 지도, 길찾기, 셔틀 경로 | 월 300만 건 무료 |
| **포트원(Port One)** | 결제 PG 통합 | 거래액의 0.25%~0.5% |
| **FCM (Firebase)** | Android 푸시 | 무료 |
| **APNs (Apple)** | iOS 푸시 | 무료 |
| **AWS S3** | 미디어(사진·영수증) 저장 | |

---

## 7. 개발 도구 & 프로세스

| 항목 | 도구 |
|---|---|
| 버전 관리 | **GitHub** |
| CI/CD | **GitHub Actions** → ECR → ECS 자동 배포 |
| 컨테이너 | **Docker** + **Docker Compose** (로컬) |
| API 문서 | **Swagger (OpenAPI 3.0)** — NestJS 자동 생성 |
| 모니터링 | **Datadog** (APM + 로그 + 알림) |
| 에러 트래킹 | **Sentry** |
| 기능 플래그 | **LaunchDarkly** (또는 직접 구현) |
| 디자인 협업 | **Figma** |
| 프로젝트 관리 | **Linear** |

---

## 8. 보안

| 항목 | 방법 |
|---|---|
| 인증 | JWT (Access 1h + Refresh 30d), Refresh Token Rotation |
| 비밀번호 | bcrypt hash (salt rounds 12) |
| API 보안 | Rate Limiting (Kong), CORS 제한 |
| 미디어 보안 | S3 Pre-signed URL (1시간 만료), 아이 사진 private bucket |
| 영수증 이미지 | S3 별도 버킷, 관리자만 접근 |
| 개인정보 | 민감 정보 암호화 저장 (AES-256), GDPR/개인정보보호법 준수 |
| HTTPS | ACM(AWS Certificate Manager) SSL |
| DDoS | AWS WAF + Shield |

---

## 9. 확장 고려사항

### 셔틀 실시간 추적 (Phase 2+)
- 강사/기사 앱에서 GPS 위치 전송 (WebSocket)
- Redis Pub/Sub으로 실시간 학부모에게 푸시

### AI 기능 (Phase 3+)
- **Claude API** 활용: 수업 추천 이유 자연어 설명, 리뷰 요약
- **추천 알고리즘**: 수강 이력 + 선호 분석 → 개인화 추천
- **이미지 인식**: 영수증 자동 OCR 인증 (AWS Textract)
