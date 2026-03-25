import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchPayload } from '../../../../../core/models/branch.model';
import { BranchService } from '../../services/branch-service';

@Component({
  selector: 'app-branch-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './branch-form-page.html',
  styleUrl: './branch-form-page.css',
})
export class BranchFormPage implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  isLoading = this.branchService.isLoading;
  isEditMode = false;
  branchId: number | null = null;

  branchForm = this.fb.nonNullable.group({
    company: this.fb.nonNullable.group({
      taxId: ['', [Validators.required]],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
    }),
    branch: this.fb.nonNullable.group({
      name: ['', [Validators.required]],
      city: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: [''],
      main: [false],
    }),
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.branchId = Number(id);
      this.loadBranchData(this.branchId);
    }
  }

  loadBranchData(id: number) {
    this.branchService.findById(id).subscribe({
      next: (data) => {
        this.branchForm.patchValue({
          branch: { ...data },
          company: { ...data.company },
        });
        this.branchForm.controls.company.disable();
      },
    });
  }

  onSubmit() {
    if (this.branchForm.invalid) {
      this.branchForm.markAllAsTouched();
      return;
    }

    const { branch, company } = this.branchForm.getRawValue();

    const payload: BranchPayload = {
      ...branch,
      company: { ...company },
    };

    const request$ =
      this.isEditMode && this.branchId
        ? this.branchService.update(this.branchId, payload)
        : this.branchService.save(payload);

    request$.subscribe({
      next: () => this.goBack(),
    });
  }

  goBack() {
    this.router.navigate(['/admin/branches']);
  }

  isInvalid(controlName: string, groupName: 'company' | 'branch'): boolean {
    const control = this.branchForm.get(`${groupName}.${controlName}`);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
