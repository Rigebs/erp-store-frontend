import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-input',
  imports: [CommonModule, MatIconModule],
  templateUrl: './filter-input.component.html',
  styleUrl: './filter-input.component.css',
})
export class FilterInputComponent {
  @Output() filterChange = new EventEmitter<string>();
  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;

  value: string = '';

  onInput(event: Event): void {
    this.value = (event.target as HTMLInputElement).value;
    this.filterChange.emit(this.value.trim().toLowerCase());
  }

  clearInput(): void {
    this.value = '';
    this.inputField.nativeElement.value = '';
    this.filterChange.emit('');
    this.inputField.nativeElement.focus();
  }
}
