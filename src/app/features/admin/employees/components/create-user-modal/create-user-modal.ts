import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { ModalService } from '../../../../../shared/services/modal-service';
import { ModalContainer } from '../../../../../shared/ui/modal-container/modal-container';

@Component({
  selector: 'app-create-user-modal',
  imports: [ReactiveFormsModule, ModalContainer],
  templateUrl: './create-user-modal.html',
  styleUrl: './create-user-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserModal {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly modalService = inject(ModalService);

  employee = input.required<any>();

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['EMPLOYEE', [Validators.required]],
  });

  constructor() {
    effect(() => {
      const email = this.employee()?.person?.email || '';
      this.form.patchValue({ email });
    });
  }

  close(): void {
    this.modalService.close();
  }

  confirm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.modalService.close(this.form.getRawValue());
  }
}
