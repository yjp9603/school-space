import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PasswordRegex, PasswordRegexMessage } from 'src/utils/password.utils';

export class UpdatePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PasswordRegex, {
    message: PasswordRegexMessage,
  })
  newPassword: string;
}
