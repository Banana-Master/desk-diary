import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '사용자의 현재 비밀번호',
    example: 'Password12!',
    required: true,
  })
  readonly password: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호가 비어 있으면 안됩니다' })
  @ApiProperty({
    description: '사용자의 새로운 비밀번호',
    example: 'newPassword12',
    required: true,
  })
  readonly newPassword: string;

  isDifferent(): boolean {
    return this.password !== this.newPassword;
  }

  @IsString()
  @IsNotEmpty()
  @Transform(({ value, obj }) => {
    return obj.newPassword === value ? value : null;
  })
  @ApiProperty({
    description: '사용자의 새로운 비밀번호 확인',
    example: 'Password12!',
    required: true,
  })
  readonly confirmNewPassword: string;
}
