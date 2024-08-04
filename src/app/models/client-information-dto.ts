import { AddressDto } from './address-dto';
import { ContactInformationDto } from './contact-information-dto';

export interface ClientInformationDto {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  idNumber: string;
  addresses: Array<AddressDto>;
  contactInformation: Array<ContactInformationDto>;
}
