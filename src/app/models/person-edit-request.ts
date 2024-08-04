import { ClientInformationDto } from "./client-information-dto";

export interface PersonEditRequest {
    clientId: string,
    clientInformationEdit: ClientInformationDto
}