import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateTechnicianDTO {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  @Length(2, 2, { message: "UF deve ter exatamente 2 dígitos" })
  state?: string;

  @IsString()
  @IsOptional()
  city?: string;
}