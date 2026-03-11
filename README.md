# 에듀픽 (EduPick)

> "성인은 취미를 디자인하고, 부모는 아이의 성장을 설계한다."

전 생애주기 맞춤형 레슨 플랫폼 — 학원 탐색·일정·결제·공지를 하나로.

---

## 문서 구조

### 성인 취미 시장 (`docs/adult/`)

| 문서 | 설명 |
|---|---|
| [PRD](docs/adult/PRD.md) | 성인 제품 요구사항 (시간표 빌더, 펀딩, 포트폴리오) |
| [UserPersonas](docs/adult/UserPersonas.md) | 번아웃 직장인, 재개 워킹맘, 원데이 탐험가 |
| [UserFlows](docs/adult/UserFlows.md) | 온보딩, 시간표 빌더, 펀딩 참여, 포트폴리오 |

### 학생/학부모 시장 (`docs/student/`)

| 문서 | 설명 |
|---|---|
| [PRD](docs/student/PRD.md) | 학부모 제품 요구사항 (셔틀 연계, 아이 리포트, 캘린더) |
| [UserPersonas](docs/student/UserPersonas.md) | 초등 멀티 학부모, 중등 내신 학부모, 신규 학부모 |
| [UserFlows](docs/student/UserFlows.md) | 온보딩, 학원 탐색, 셔틀 알림, 리포트, 시간표 빌더 |

### 공통 문서 (`docs/`)

| 문서 | 설명 |
|---|---|
| [BusinessModel](docs/BusinessModel.md) | 수익 모델, Unit Economics, 플라이휠 |
| [CompetitiveAnalysis](docs/CompetitiveAnalysis.md) | 경쟁사 분석, 포지셔닝 전략 |
| [TechStack](docs/TechStack.md) | 기술 스택, 인프라, 외부 API 연동 |
| [Roadmap](docs/Roadmap.md) | Phase 0~3 로드맵, 우선순위 매트릭스 |
| [OpenSpec](docs/OpenSpec.md) | REST API 전체 명세, WebSocket |
| [DataStrategy](docs/DataStrategy.md) | 학원 정보 수집 전략 (공공API·크롤링·온보딩·법적 검토) |

---

## 두 시장의 핵심 차이

| 구분 | 성인 취미 | 학생/학부모 |
|---|---|---|
| 핵심 니즈 | 내 시간에 맞는 수업 + 신뢰 후기 | 아이 안전 + 일정 통합 + 정보 신뢰 |
| 킬러 기능 | 스마트 시간표 빌더 + 펀딩 | 셔틀 연계 알림 + 프라이빗 리포트 |
| 결제 구조 | 횟수권 / 원데이 / 월납 | 월납 자동 결제 |
| 앱 체류 동기 | 성장 포트폴리오 | 매일 아이 알림 확인 |
| 진입 우선순위 | Phase 2 (M6~) | Phase 1 (M1~, 핵심) |

---

## 핵심 차별화

1. **셔틀 연계 엔진**: A→B 학원 셔틀 연계 가능 여부 자동 판단
2. **인증 리뷰**: 결제 영수증 인증 필수 — 광고 없는 진짜 후기
3. **수업 개설 펀딩**: 최소 인원 모이면 개설되는 공동구매형 클래스
4. **카카오 알림톡**: 앱 미설치자도 공지 수신 (설치 장벽 해소)
5. **프라이빗 아이 리포트**: 단체방 노출 없이 내 아이 기록만

---

## Phase 1 집중 전략

```
1. 강남 3구 발레/피아노/미술 학원 강사 50명 온보딩 (학부모 시장 선점)
2. 강사 → 학부모 초대 링크로 B2B2C 바이럴 구조 완성
3. 카카오 알림톡 연동으로 앱 설치 장벽 최소화
4. 성인 취미 시장은 M6 이후 확장
```
