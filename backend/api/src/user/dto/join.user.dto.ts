import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class JoinUserDto {
  @IsEmail({}, { message: '이메일 형식이 아닙니다' })
  @IsNotEmpty({ message: '이메일이 비어 있으면 안됩니다' })
  @ApiProperty({
    description: '사용자의 이메일 주소',
    example: 'user@example.com',
    required: true,
  })
  email: string;

  @IsString()
  @IsNotEmpty({ message: '닉네임이 비어 있으면 안됩니다' })
  @MinLength(2)
  @MaxLength(5)
  @ApiProperty({
    description: '사용자의 닉네임',
    example: '무거운엉덩이123abc',
    required: true,
  })
  nickname: string;

  @IsString()
  @IsNotEmpty({ message: '비밀번호가 비어 있으면 안됩니다' })
  @ApiProperty({
    description: '사용자의 비밀번호',
    example: 'password12',
    required: true,
  })
  password: string;
}
