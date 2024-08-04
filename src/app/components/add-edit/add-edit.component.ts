import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientInformationService } from '../../services/client-information.service';
import { Subject, takeUntil } from 'rxjs';
import { SingleClientResponse } from '../../models/single-client-response';
import { ClientInformationDto } from '../../models/client-information-dto';
import { NewPersonRequest } from '../../models/new-person-request';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class AddEditComponent implements OnInit {
  public card: SingleClientResponse = { client: {} as ClientInformationDto };
  clientForm!: FormGroup;
  destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clientService: ClientInformationService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Fetch the card details by id, for now using dummy data
      this.clientService
        .getClient(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (data) => {
            this.card = data;
            this.setFormValues(this.card.client)
          },
          (error) => {
            console.error('Error fetching client', error);
          }
        );
    }
    else {
      this.clientForm = this.formBuilder.group({
        client: this.formBuilder.group({
          firstName: ['', Validators.required],
          lastName: ['', Validators.required],
          dateOfBirth: ['', Validators.required],
          gender: ['', Validators.required],
          idNumber: ['', [Validators.required, Validators.maxLength(13)]],
          addresses: this.formBuilder.array([{
            street: ['', Validators.required],
            city: ['', Validators.required],
            postalCode: ['', [Validators.required, Validators.maxLength(4)]],
            province: ['', Validators.required]
          }]),
          contactInformation: this.formBuilder.array([{
            cellPhoneNumber: ['', Validators.required],
            telePhoneNumber: ['', Validators.required],
            workPhoneNumber: ['', Validators.required],
            emailAddress: ['', [Validators.required, Validators.email]]
          }])
        })
      });
    }

    if (!this.card.client.dateOfBirth) {
      const today = new Date();
      this.card.client.dateOfBirth = today.toISOString().split('T')[0];
    }
  }

  get addresses(): FormArray {
    return this.clientForm.get('client.addresses') as FormArray;
  }

  get contactInformation(): FormArray {
    return this.clientForm.get('client.contactInformation') as FormArray;
  }

  setFormValues(clientData: any): void {
    const client = this.clientForm.get('client') as FormGroup;
    client.patchValue({
      firstName: clientData.firstName,
      lastName: clientData.lastName,
      dateOfBirth: clientData.dateOfBirth,
      gender: clientData.gender,
      idNumber: clientData.idNumber
    });

    this.setAddresses(clientData.addresses);
    this.setContactInformation(clientData.contactInformation);
  }

  setAddresses(addresses: any[]): void {
    const addressFormArray = this.clientForm.get('client.addresses') as FormArray;
    addresses.forEach(address => {
      addressFormArray.push(this.formBuilder.group({
        street: [address.street, Validators.required],
        city: [address.city, Validators.required],
        postalCode: [address.postalCode, [Validators.required, Validators.maxLength(4)]],
        province: [address.province, Validators.required]
      }));
    });
  }

  setContactInformation(contactInformation: any[]): void {
    const contactFormArray = this.clientForm.get('client.contactInformation') as FormArray;
    contactInformation.forEach(contact => {
      contactFormArray.push(this.formBuilder.group({
        cellPhoneNumber: [contact.cellPhoneNumber, Validators.required],
        telePhoneNumber: [contact.telePhoneNumber, Validators.required],
        workPhoneNumber: [contact.workPhoneNumber, Validators.required],
        emailAddress: [contact.emailAddress, [Validators.required, Validators.email]]
      }));
    });
  }


  save(): void {
    this.card.client.dateOfBirth = new Date(this.card.client.dateOfBirth).toISOString().split('T')[0];
    if (this.card.client.id) {
      this.clientService
        .updateClient({
          clientId: this.card.client.id,
          clientInformationEdit: this.card.client,
        })
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    } else {
      const clientinformationDto = {
        ...this.card.client,
      } as ClientInformationDto;
      this.clientService
        .createClient({ clientInformation: clientinformationDto })
        .subscribe(() => {
          this.router.navigate(['/']);
        });
      this.router.navigate(['/']);
    }
  }


  addAddress(): void {
    this.card.client.addresses.push({
      street: '',
      city: '',
      postalCode: '',
      province: ''
    });
  }

  removeAddress(index: number): void {
    this.card.client.addresses.splice(index, 1);
  }

  addContact(): void {
    this.card.client.contactInformation.push({
      cellPhoneNumber: '',
      telePhoneNumber: '',
      workPhoneNumber: '',
      emailAddress: ''
    });
  }

  removeContact(index: number): void {
    this.card.client.contactInformation.splice(index, 1);
  }

}
