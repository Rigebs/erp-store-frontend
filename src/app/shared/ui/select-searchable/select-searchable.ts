import {
  Component,
  ElementRef,
  inject,
  signal,
  computed,
  ChangeDetectionStrategy,
  OnDestroy,
  input,
  output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, ReactiveFormsModule, NgControl } from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-select-searchable',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './select-searchable.html',
  styleUrl: './select-searchable.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchable implements ControlValueAccessor, OnDestroy {
  // Inputs
  options = input<any[]>([]);
  labelKey = input<string>('label');
  placeholder = input<string>('Seleccionar...');

  // Evento para que el padre cargue más datos
  onNextPage = output<string>();

  // Inyecciones
  public ngControl = inject(NgControl, { self: true, optional: true });
  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  // Estado con Signals
  value = signal<any>(null);
  isOpen = signal(false);
  disabled = signal(false);
  dropdownStyles = signal<any>({});

  searchControl = new FormControl<string>('', { nonNullable: true });
  private cleanupListeners: (() => void)[] = [];

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Escuchar cambios en la búsqueda para notificar al padre o resetear
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((term) => {
      // Podrías emitir un evento de 'reset' aquí si fuera necesario
    });
  }

  // Lógica de error para el trigger
  get isError(): boolean {
    return !!(this.ngControl?.invalid && (this.ngControl?.touched || this.ngControl?.dirty));
  }

  // Label a mostrar en el trigger
  selectedLabel = computed(() => {
    const current = this.value();
    if (!current) return this.placeholder();
    return typeof current === 'object' ? current[this.labelKey()] : current;
  });

  // Control del scroll infinito
  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const threshold = 15; // píxeles antes de llegar al final
    const reachedBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + threshold;

    if (reachedBottom && !this.disabled()) {
      this.onNextPage.emit(this.searchControl.value);
    }
  }

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
    };

    if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
      styles.bottom = `${viewportHeight - rect.top + margin}px`;
      styles.top = 'auto';
    } else {
      styles.top = `${rect.bottom + margin}px`;
      styles.bottom = 'auto';
    }

    this.dropdownStyles.set(styles);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
    this.searchControl.setValue('', { emitEvent: false });
    this.isOpen.set(true);

    requestAnimationFrame(() => this.updateDropdownPosition());

    const scrollHandler = () => this.isOpen() && this.updateDropdownPosition();
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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
    if (!this.isOpen()) return;
    this.isOpen.set(false);
    this.onTouched();
    this.cleanupListeners.forEach((fn) => fn());
    this.cleanupListeners = [];
  }

  // ControlValueAccessor
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

  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

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
