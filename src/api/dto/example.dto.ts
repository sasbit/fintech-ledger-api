// import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";
// import { ApiProperty } from "@nestjs/swagger";

export class ExampleRequestDto {
  // @ApiProperty({ description: "Example string field", example: "sample value" })
  // @IsString()
  // @IsNotEmpty()
  name: string;

  // @ApiProperty({ description: "Example number field", example: 100 })
  // @IsNumber()
  amount: number;

  // @ApiProperty({ description: "Optional field", required: false })
  // @IsOptional()
  // @IsString()
  description?: string;

  // TODO: Add validation decorators and API properties as needed
}

export class ExampleResponseDto {
  // @ApiProperty({ description: "Example string field", example: "sample value" })
  // @IsString()
  // @IsNotEmpty()
  name: string;
}
