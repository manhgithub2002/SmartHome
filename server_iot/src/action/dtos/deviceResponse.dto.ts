import { ApiProperty } from '@nestjs/swagger';

export class DeviceResponse {
  @ApiProperty()
  led?: string;

  @ApiProperty()
  fan?: string;
}
