import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from "class-validator";


export class CreateTechnicianDTO {
  @IsString()
  @IsNotEmpty({ message: "Nome completo é obrigatório" })
  fullName!: string;

  @IsString()
  @IsNotEmpty({ message: "Telefone é obrigatório" })
  phone!: string;

  @IsEmail({}, { message: "E-mail inválido" })
  @IsNotEmpty({ message: "E-mail é obrigatório" })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: "CEP é obrigatório" })
  zipCode!: string;

  @IsString()
  @IsNotEmpty({ message: "UF é obrigatória" })
  @Length(2, 2, { message: "UF deve ter exatamente 2 dígitos" })
  state!: string;

  @IsString()
  @IsNotEmpty({ message: "Cidade é obrigatória" })
  city!: string;
}
