/**
 * 비밀번호 정책 정규식
 *  - 영문, 숫자, 특수문자 조합 8자 이상
 *  - 최대 32자
 *  ex) qwer1234#
 */

export const PasswordRegex =
  /^(?=.*[a-zA-Z])(?=.*[!@#$^*+=-])(?=.*[0-9]).{8,32}$/;

export const PasswordRegexMessage =
  '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.';
