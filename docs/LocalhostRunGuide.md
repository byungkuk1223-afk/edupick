# EduPick 로컬 실행 가이드 (Windows CMD 기준)

## 목적

`C:\Users\RAN\edupick` 경로에서 API와 Web을 localhost로 실행하고 확인하는 방법을 정리합니다.

기본 접속 주소:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- Swagger: `http://localhost:4000/api/docs`

---

## 1. 선행 조건

아래 항목이 먼저 설치되어 있어야 합니다.

- Node.js 20 이상
- pnpm 9 이상
- Docker Desktop

버전 확인:

```cmd
node -v
pnpm -v
docker -v
```

---

## 2. 프로젝트 폴더로 이동

```cmd
cd /d C:\Users\RAN\edupick
```

`/d` 옵션을 넣으면 드라이브가 달라도 바로 이동됩니다.

---

## 3. 최초 1회 설정

### 3.1 패키지 설치

```cmd
pnpm install
```

### 3.2 API 환경 변수 확인

API는 `apps\api\.env` 파일을 사용합니다.

예시 기준 핵심 값:

```env
DATABASE_URL=postgresql://postgres:edupick123@localhost:5433/edupick
REDIS_URL=redis://localhost:6379
PORT=4000
```

`apps\api\.env`가 없다면 예제 파일을 복사해서 시작합니다.

```cmd
copy apps\api\.env.example apps\api\.env
```

### 3.3 Web 환경 변수 확인

Web은 `apps\web\.env.local` 파일을 사용합니다.

예시 기준 핵심 값:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/v1
```

파일이 없다면 예제 파일을 복사합니다.

```cmd
copy apps\web\.env.example apps\web\.env.local
```

---

## 4. 로컬 의존 서비스 실행

PostgreSQL과 Redis를 Docker로 올립니다.

```cmd
pnpm docker:up
```

정상 실행 확인:

```cmd
docker ps
```

기대 컨테이너:

- `edupick-postgres`
- `edupick-redis`

기본 포트:

- PostgreSQL: `localhost:5433`
- Redis: `localhost:6379`

---

## 5. DB 준비

### 5.1 Prisma Client 생성

```cmd
pnpm db:generate
```

### 5.2 마이그레이션 적용

```cmd
pnpm db:migrate
```

### 5.3 샘플 데이터가 필요하면 시드 실행

```cmd
pnpm db:seed
```

또는 학원 동기화 시드:

```cmd
pnpm data:seed
```

외부 API 키가 아직 없으면 일부 시드나 연동 기능은 제한될 수 있습니다.

---

## 6. API 실행

새 CMD 창을 열고 아래를 실행합니다.

```cmd
cd /d C:\Users\RAN\edupick
pnpm dev:api
```

기본 동작:

- NestJS 서버가 실행됩니다.
- 기본 포트는 `4000`입니다.
- 전역 prefix가 `v1`이라 실제 API base URL은 `http://localhost:4000/v1`입니다.

정상 실행 로그 예시:

```text
EduPick API is running on http://localhost:4000
Swagger docs: http://localhost:4000/api/docs
```

확인 주소:

- `http://localhost:4000/api/docs`

---

## 7. Web 실행

다른 CMD 창을 하나 더 열고 아래를 실행합니다.

```cmd
cd /d C:\Users\RAN\edupick
pnpm dev:web
```

기본 동작:

- Next.js 개발 서버가 실행됩니다.
- 기본 포트는 `3000`입니다.
- Web은 `NEXT_PUBLIC_API_URL` 값을 사용해 API와 통신합니다.

확인 주소:

- `http://localhost:3000`

---

## 8. 실제 확인 순서

### 8.1 API 확인

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:4000/api/docs
```

Swagger 화면이 열리면 API는 정상입니다.

### 8.2 Web 확인

브라우저에서 아래 주소를 엽니다.

```text
http://localhost:3000
```

페이지가 열리고, 데이터 조회가 필요한 화면에서 API 응답이 정상적으로 붙으면 연결도 정상입니다.

---

## 9. 권장 실행 순서 요약

최초 1회:

```cmd
cd /d C:\Users\RAN\edupick
pnpm install
pnpm docker:up
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

평소 실행:

CMD 창 1

```cmd
cd /d C:\Users\RAN\edupick
pnpm dev:api
```

CMD 창 2

```cmd
cd /d C:\Users\RAN\edupick
pnpm dev:web
```

브라우저 확인:

- `http://localhost:4000/api/docs`
- `http://localhost:3000`

---

## 10. 종료 방법

API와 Web을 실행한 CMD 창에서 각각 `Ctrl + C`를 누릅니다.

Docker 컨테이너까지 내리려면:

```cmd
cd /d C:\Users\RAN\edupick
pnpm docker:down
```

볼륨까지 초기화하고 다시 시작하려면:

```cmd
cd /d C:\Users\RAN\edupick
pnpm docker:reset
```

주의:

- `docker:reset`은 DB 데이터를 지우고 다시 올립니다.

---

## 11. 자주 막히는 경우

### 11.1 `pnpm` 명령이 없다고 나오는 경우

```cmd
npm install -g pnpm
```

### 11.2 API가 DB에 연결되지 않는 경우

아래를 확인합니다.

- Docker Desktop이 실행 중인지
- `docker ps`에서 `edupick-postgres`, `edupick-redis`가 살아 있는지
- `apps\api\.env`의 `DATABASE_URL`, `REDIS_URL`이 예제와 맞는지

### 11.3 Web에서 API 호출이 실패하는 경우

아래를 확인합니다.

- API가 먼저 실행 중인지
- `apps\web\.env.local`의 `NEXT_PUBLIC_API_URL`이 `http://localhost:4000/v1`인지

### 11.4 포트 충돌이 나는 경우

아래 포트를 이미 다른 프로세스가 쓰고 있는지 확인합니다.

- `3000`
- `4000`
- `5433`
- `6379`

Windows CMD에서 확인:

```cmd
netstat -ano | findstr :3000
netstat -ano | findstr :4000
netstat -ano | findstr :5433
netstat -ano | findstr :6379
```

---

## 12. 빠른 체크용 최소 명령

```cmd
cd /d C:\Users\RAN\edupick
pnpm docker:up
pnpm dev:api
```

새 CMD 창:

```cmd
cd /d C:\Users\RAN\edupick
pnpm dev:web
```

이후 브라우저에서:

- `http://localhost:4000/api/docs`
- `http://localhost:3000`
