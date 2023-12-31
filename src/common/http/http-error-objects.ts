export interface HttpErrorFormat {
  errorCode: string;
  message: string;
}

export const HttpErrorConstants = {
  UNAUTHORIZED: {
    errorCode: 'UNAUTHORIZED',
    message: '로그인이 필요합니다.',
  } as HttpErrorFormat,

  FORBIDDEN: {
    errorCode: 'FORBIDDEN',
    message: '권한이 없습니다.',
  } as HttpErrorFormat,

  INTERNAL_SERVER_ERROR: {
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: '알 수 없는 오류가 발생하였습니다.',
  } as HttpErrorFormat,

  EXIST_EMAIL: {
    errorCode: 'EXIST_EMAIL',
    message: '이미 가입된 이메일입니다.',
  } as HttpErrorFormat,

  INVALID_AUTH: {
    errorCode: 'UNAUTHORIZED',
    message: '이메일 또는 비밀번호가 올바르지 않습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_USER: {
    errorCode: 'CANNOT_FIND_USER',
    message: '유저를 찾을 수 없습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_SPACE: {
    errorCode: 'CANNOT_FIND_SPACE',
    message: '공간을 찾을 수 없습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_ROLE: {
    errorCode: 'CANNOT_FIND_ROLE',
    message: '해당 역할이 없습니다.',
  } as HttpErrorFormat,

  EXPIRED_ACCESS_TOKEN: {
    errorCode: 'EXPIRED_ACCESS_TOKEN',
    message: '액세스 토큰이 만료되었습니다.',
  } as HttpErrorFormat,

  EXPIRED_REFRESH_TOKEN: {
    errorCode: 'EXPIRED_REFRESH_TOKEN',
    message: '리프레시 토큰이 만료되었습니다. 다시 로그인이 필요합니다.',
  },

  CANNOT_FIND_POST: {
    errorCode: 'CANNOT_FIND_POST',
    message: '게시글을 찾을 수 없습니다.',
  } as HttpErrorFormat,

  CANNOT_FIND_CHAT: {
    errorCode: 'CANNOT_FIND_CHAT',
    message: '댓글을 찾을 수 없습니다.',
  } as HttpErrorFormat,

  UNPROCESSABLE_ENTITY: {
    errorCode: 'UNPROCESSABLE_ENTITY',
    message: '필수값을 보내지 않았습니다.',
  } as HttpErrorFormat,

  ALREADY_JOINED_SPACE: {
    errorCode: 'ALREADY_JOINED_SPACE',
    message: '이미 참여한 공간입니다.',
  } as HttpErrorFormat,

  ALREADY_USED_ROLE: {
    errorCode: 'ALREADY_USED_ROLE',
    message: '이미 사용중인 역할입니다.',
  } as HttpErrorFormat,

  FORBIDDEN_ANONYMOUS: {
    errorCode: 'FORBIDDEN_ANONYMOUS',
    message: '익명 작성은 참가자만 가능합니다.',
  } as HttpErrorFormat,
};
