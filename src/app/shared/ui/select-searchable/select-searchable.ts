import {
  Component,
  ElementRef,
  inject,
  signal,
  computed,
  forwardRef,
  ChangeDetectionStrategy,
  OnDestroy,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
  NgControl,
} from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-select-searchable',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './select-searchable.html',
  styleUrl: './select-searchable.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchable implements ControlValueAccessor, OnDestroy {
  options = input<any[]>([]);
  labelKey = input<string>('label');
  placeholder = input<string>('Seleccionar...');

  public ngControl = inject(NgControl, { self: true, optional: true });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  value = signal<any>(null);
  isOpen = signal(false);
  disabled = signal(false);
  dropdownStyles = signal<any>({});

  searchControl = new FormControl<string>('', { nonNullable: true });
  private cleanupListeners: (() => void)[] = [];

  get isError(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
  }

  filteredOptions = computed(() => {
    const term = this.searchControl.value.toLowerCase();
    const list = this.options();
    if (!term) return list;
    return list.filter((opt) => String(opt[this.labelKey()]).toLowerCase().includes(term));
  });

  selectedLabel = computed(() => {
    const current = this.value();
    if (!current) return this.placeholder();
    return typeof current === 'object' ? current[this.labelKey()] : current;
  });

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  private updateDropdownPosition() {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = 310;
    const margin = 5;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let styles: any = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '2000',
      pointerEvents: 'auto',
    };

    if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
      styles.bottom = `${viewportHeight - rect.top + margin}px`;
      styles.top = 'auto';
      styles.animation = 'fadeInUp 0.15s ease-out';
    } else {
      styles.top = `${rect.bottom + margin}px`;
      styles.bottom = 'auto';
      styles.animation = 'fadeInDown 0.15s ease-out';
    }

    this.dropdownStyles.set(styles);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;

    this.searchControl.setValue('');
    this.isOpen.set(true);

    requestAnimationFrame(() => this.updateDropdownPosition());

    const scrollHandler = () => {
      if (this.isOpen()) this.updateDropdownPosition();
    };

    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Si el clic es fuera del componente, cerramos
      if (!this.el.nativeElement.contains(target) && !target.closest('.select-dropdown')) {
        this.close();
      }
    };

    this.document.addEventListener('scroll', scrollHandler, true);
    this.document.addEventListener('mousedown', clickHandler);
    window.addEventListener('resize', scrollHandler);

    this.cleanupListeners.push(
      () => this.document.removeEventListener('scroll', scrollHandler, true),
      () => this.document.removeEventListener('mousedown', clickHandler),
      () => window.removeEventListener('resize', scrollHandler),
    );
  }

  close(): void {
    if (!this.isOpen()) return; // Evitar llamadas dobles
    this.isOpen.set(false);
    this.onTouched(); // <--- CRITICO: Avisa a Angular que el componente fue "tocado"
    this.cleanupListeners.forEach((fn) => fn());
    this.cleanupListeners = [];
  }

  writeValue(val: any): void {
    this.value.set(val);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  selectOption(opt: any): void {
    this.value.set(opt);
    this.onChange(opt);
    this.onTouched();
    this.close();
  }

  ngOnDestroy() {
    this.close();
  }
}
