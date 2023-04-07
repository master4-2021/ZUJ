import { IsNotEmpty, IsString } from 'class-validator';

export class CrudDto {
  @IsNotEmpty()
  @IsString()
  displayName: string;
}
