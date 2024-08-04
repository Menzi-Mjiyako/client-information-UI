import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientInformationService } from '../../services/client-information.service';
import { Subject, takeUntil } from 'rxjs';
import { ClientCollectionResponse } from '../../models/client-collection-response';
import { ClientInformationStateService } from '../../services/client-information-state.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class HomeComponent implements OnInit {
  cards: ClientCollectionResponse = { clients: [] };
  destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private clientService: ClientInformationService
  ) {}

  ngOnInit(): void {
    this.clientService
      .getClients()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.cards = data;
        },
        (error) => {
          console.error('Error fetching clients', error);
        }
      );
  }

  editCard(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  addCard(): void {
    this.router.navigate(['/add']);
  }

  exportData() {
    this.clientService.exportClientData().subscribe(
      (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ClientInformation.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Download failed', error);
      }
    );
  }
}
