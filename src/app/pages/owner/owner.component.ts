import { Component, OnInit, OnDestroy } from '@angular/core';
import { Owner } from '../../models/owner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OwnerService } from '../../services/owner.service'; // Make sure this path is correct
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common'; // NgIf, NgFor are from here

@Component({
  selector: 'app-owner',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './owner.component.html',
  styleUrl: './owner.component.scss'
})
export class OwnerComponent implements OnInit, OnDestroy {
  owners: Owner[] = [];
  private destroy$ = new Subject<void>();
  showOwnerForm = false;
  ownerForm!: FormGroup;
  showDeleteConfirmation = false;
  ownerToDeleteId: number | null = null;

  constructor(
    private router: Router,
    private ownerService: OwnerService, // Ensure this is injected and correct
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.ownerForm = this.fb.group({
      id: [null as number | null], // Explicitly type id control for clarity
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
    });
    this.loadOwners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    sessionStorage.removeItem("auth-token");
    sessionStorage.removeItem("username");
    this.router.navigate(["/login"]);
  }

  loadOwners(): void {
    this.ownerService.getOwners() // Assumes getOwners exists in OwnerService
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Owner[]) => {
          this.owners = data;
        },
        error: (err: any) => {
          console.error('Erro ao carregar proprietários:', err);
        }
      });
  }

  saveOwnerOrUpdate(): void {
    if (this.ownerForm.invalid) {
      console.log("Formulário inválido.");
      this.ownerForm.markAllAsTouched();
      return;
    }

    // --- Use a consistent variable name for the form data ---
    const currentOwnerData: Owner = this.ownerForm.value;

    if (currentOwnerData.id) { // Check if an ID exists (meaning it's an update)
      // --- UPDATE existing owner ---
      this.ownerService.updateOwner(currentOwnerData) // Call the service method
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedOwner: Owner) => {
            console.log('Proprietário atualizado com sucesso:', updatedOwner);
            this.loadOwners();
            this.showOwnerForm = false;
            this.ownerForm.reset();
          },
          error: (err: any) => {
            console.error('Erro ao atualizar proprietário:', err);
          }
        });
    } else {
      // Assuming your Owner model and service.addOwner can handle `id: null`
      this.ownerService.addOwner(currentOwnerData) // Call the service method
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (newlyAddedOwner: Owner) => { // Renamed for clarity
            console.log('Proprietário adicionado com sucesso:', newlyAddedOwner);
            this.loadOwners(); // Reload to get the complete list with new ID
            this.showOwnerForm = false;
            this.ownerForm.reset();
          },
          error: (err: any) => {
            console.error('Erro ao salvar proprietário:', err);
          }
        });
    }
  }


  displayOwnerForm(): void {
    this.ownerForm.reset();
    this.ownerForm.get('id')?.setValue(null); // Ensure ID is null for add mode
    this.showOwnerForm = true;
  }

  onEdit(owner: Owner): void {
    this.showOwnerForm = true;
    this.ownerForm.patchValue(owner);
  }

  cancelOperation(): void {
    this.showOwnerForm = false;
    this.ownerForm.reset();
  }

  promptForDelete(ownerId: number): void {
    console.log('Prompting for delete for owner ID:', ownerId);
    this.ownerToDeleteId = ownerId;
  }

  /**
   * Handles the user's decision from the delete confirmation dialog (Sim/Cancelar).
   * This should be called by the "Sim" and "Cancelar" buttons in the template.
   * @param confirmed True if "Sim" was clicked, false if "Cancelar" was clicked.
   */
  handleDeleteConfirmation(confirmed: boolean): void {
    console.log(`Delete confirmation received: ${confirmed}, for owner ID: ${this.ownerToDeleteId}`);
    if (confirmed && this.ownerToDeleteId !== null) {
      // User clicked "Sim" and we have a target ID
      this.ownerService.deleteOwner(this.ownerToDeleteId) // Pass the stored ID
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            console.log(`Owner with ID ${this.ownerToDeleteId} deleted successfully.`);
            this.loadOwners(); // Refresh the list
            this.ownerToDeleteId = null; // Reset/hide confirmation after action
          },
          error: (err: any) => {
            console.error(`Error deleting owner with ID ${this.ownerToDeleteId}:`, err);
            // Optionally, keep ownerToDeleteId set to allow retry or show error message near confirmation
            // For now, we'll reset it to hide the confirmation.
            this.ownerToDeleteId = null;
          }
        });
    } else {
      // User clicked "Cancelar" or there was no ownerToDeleteId
      console.log('Deletion cancelled or no target ID.');
      this.ownerToDeleteId = null; // Reset/hide confirmation
    }
  }


}