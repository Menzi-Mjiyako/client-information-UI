import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientInformationService } from '../../services/client-information.service';
import { Subject, takeUntil } from 'rxjs';
import { SingleClientResponse } from '../../models/single-client-response';
import { ClientInformationDto } from '../../models/client-information-dto';
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

    this.initForm();

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
      dateOfBirth: new Date(clientData.dateOfBirth).toISOString().split('T')[0],
      gender: clientData.gender,
      idNumber: clientData.idNumber
    });

    this.setAddresses(clientData.addresses);
    this.setContactInformation(clientData.contactInformation);
  }

  initForm(): void {
    this.clientForm = this.formBuilder.group({
      client: this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        idNumber: ['', [Validators.required, Validators.maxLength(13)]],
        addresses: this.formBuilder.array([this.createAddress()]),
        contactInformation: this.formBuilder.array([this.createContact()])
      })
    });
  }

  createAddress(): FormGroup {
    return this.formBuilder.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.maxLength(4)]],
      province: ['', Validators.required]
    });
  }

  createContact(): FormGroup {
    return this.formBuilder.group({
      cellPhoneNumber: ['', Validators.required],
      telePhoneNumber: [''],
      workPhoneNumber: [''],
      emailAddress: ['', [Validators.required, Validators.email]]
    });
  }

  setAddresses(addresses: any[]): void {
        const addressFormArray = this.clientForm.get('client.addresses') as FormArray;
    addressFormArray.clear();
    addresses.forEach(address => {
      addressFormArray.push(this.createAddress());
    });
    addressFormArray.patchValue(addresses);
  }

  setContactInformation(contactInformation: any[]): void {
    const contactFormArray = this.clientForm.get('client.contactInformation') as FormArray;
    contactFormArray.clear();
    contactInformation.forEach(contact => {
      contactFormArray.push(this.createContact());
    });
    contactFormArray.patchValue(contactInformation);
  }


  save(): void {
    let client = this.clientForm.getRawValue().client as ClientInformationDto;

    if (this.card.client.id) {
      this.clientService
        .updateClient({
          clientId: client.id,
          clientInformationEdit: client,
        })
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    } else {
      this.clientService
        .createClient({ clientInformation: client })
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
