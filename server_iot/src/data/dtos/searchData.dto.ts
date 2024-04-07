import { ApiProperty } from "@nestjs/swagger";
import { DeviceCategory } from "src/action/action.service";

export class SearchDto {
    @ApiProperty()
    keyword: string;

    @ApiProperty({ name: 'category', enum: DeviceCategory, required: false })
    category: string;
}