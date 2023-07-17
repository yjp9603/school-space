## 실행 방법

- yarn 또는 yarn install 으로 package.json 설치 후 아래 명령어로 실행시켜주세요.
- yarn dev (개발 환경 실행 명령어)
- yarn prod (운영 환경 실행 명령어)

DB: SQLite 사용.
1. VSCode 확장에서 SQLite 플러그인 설치
2. 보기 - 명령 팔레트 - SQLite: Open Database 클릭
3. 탐색기 아래에 SQLITE EXPLORER에 스키마 생성 확인


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
- 유저가 참여중인 공간 목록 조회 GET /space?page=1&size=20&order=DESC
- 공간 삭제 DELETE /spaces/{spaceId}
- 공간 참여하기 POST /spaces/join
- 공간에서 유저 역할 삭제 DELETE /spaces/{spaceId}/role/{roleId}
- 권한 변경 PATCH /spaces/{spaceId}/role/{roleId}


[Posts]
- 게시글 작성 POST /posts
- 게시글 목록 조회 GET /posts?spaceId=1&page=1&size=20&order=DESC
- 게시글 상세 조회 + 댓글 목록 조회 GET /posts/{postId}
- 게시글 삭제 DELETE /posts/30?spaceId=2

[Chats]
- 댓글 작성 POST /chats
- 댓글 삭제 DELETE /chats/{chatId}





