import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-discount-input',
  templateUrl: './discount-input.html',
  styleUrl: './discount-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiscountInput {
  value = input.required<number>();
  changed = output<number>();

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newValue = parseFloat(inputElement.value);

    if (isNaN(newValue) || newValue < 0) {
      newValue = 0;
    } else if (newValue > 100) {
      newValue = 100;
    }

    inputElement.value = newValue.toString();
    this.changed.emit(newValue);
  }
}
