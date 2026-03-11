import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.html',
  styleUrl: './slide-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SlideToggle),
      multi: true,
    },
  ],
  host: {
    '[class.disabled]': 'disabled()',
    '(click)': 'toggle()',
  },
})
export class SlideToggle implements ControlValueAccessor {
  checked = model<boolean>(false);
  disabled = signal<boolean>(false);
  label = input<string>('');

  onChange: (value: boolean) => void = () => {};
  onTouched: () => void = () => {};

  toggle(): void {
    if (this.disabled()) return;

    this.checked.update((val) => !val);
    this.onChange(this.checked());
    this.onTouched();
  }

  writeValue(value: boolean): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }
}
