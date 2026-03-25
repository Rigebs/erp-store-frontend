import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { BranchService } from '../../services/branch-service';
import { BranchPayload } from '../../../../../core/models/branch.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-branch-list-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './branch-list-page.html',
  styleUrl: './branch-list-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'page-layout' },
})
export class BranchListPage {
  private readonly branchService = inject(BranchService);
  private readonly router = inject(Router);

  branches = this.branchService.branches;
  isLoading = this.branchService.isLoading;

  ngOnInit(): void {
    this.branchService.findAll().subscribe();
  }

  goToCreate() {
    this.router.navigate(['/admin/branches/new']);
  }

  goToEdit(id: number) {
    this.router.navigate(['/admin/branches/edit', id]);
  }

  toggleStatus(id: number) {
    this.branchService.toggleEnabled(id).subscribe();
  }
}
