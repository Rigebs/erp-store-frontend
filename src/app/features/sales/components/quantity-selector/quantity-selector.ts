import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-quantity-selector',
  templateUrl: './quantity-selector.html',
  styleUrl: './quantity-selector.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuantitySelector {
  value = input.required<number>();
  stock = input.required<number>();
  changed = output<number>();

  handleInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let newValue = parseInt(inputElement.value, 10);

    if (isNaN(newValue) || newValue < 1) {
      newValue = 1;
    } else if (newValue > this.stock()) {
      newValue = this.value();
    }

    inputElement.value = newValue.toString();
    this.changed.emit(newValue);
  }

  adjust(delta: number) {
    const nextValue = this.value() + delta;
    if (nextValue >= 1 && nextValue <= this.stock()) {
      this.changed.emit(nextValue);
    }
  }
}
