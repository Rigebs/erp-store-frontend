import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';

@Component({
  selector: 'app-modal-container',
  imports: [],
  templateUrl: './modal-container.html',
  styleUrl: './modal-container.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalContainer {
  close = output<void>();
}
