## 실행 방법

- yarn 또는 yarn install 으로 package.json 설치 후 아래 명령어로 실행시켜주세요.
- yarn dev (개발 환경 실행 명령어)
- yarn prod (운영 환경 실행 명령어)

DB: SQLite 사용

공통 url: localhost:3000

[Users]
- 회원가입       POST users
- 유저 정보 조회 GET /users/{id}
- 유저 정보 수정 PATCH /users/{id}
- 비밀번호 수정  PATCH /users/password

[Auth]
- 로그인 POST /auth
- 액세스 토큰 재발급 /auth/token

[Spaces]
- 공간 생성 POST /spaces
- 유저가 참여중인 공간 목록 조회 
- 공간 참여
...
...























GET 






GET


PATCH


DELETE









