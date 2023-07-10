import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { PasswordRegex } from 'src/utils/password.utils';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message:
      '비밀번호 형식이 적절하지 않습니다. 비밀번호는 영문, 숫자, 특수문자가 포함된 8자 이상으로만 가능합니다.',
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  name: {
    firstName: string;
    lastName: string;
  };

  @IsOptional()
  @IsEmpty()
  profilePath: string;
}
