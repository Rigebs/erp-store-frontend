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
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-select-searchable',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './select-searchable.html',
  styleUrl: './select-searchable.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchable implements ControlValueAccessor, OnDestroy {
  options = input<any[]>([]);
  labelKey = input<string>('label');
  placeholder = input<string>('Seleccionar...');

  onNextPage = output<string>();
  onSearch = output<string>();

  public ngControl = inject(NgControl, { self: true, optional: true });
  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  value = signal<any>(null);
  isOpen = signal(false);
  disabled = signal(false);
  dropdownStyles = signal<Record<string, string>>({});

  searchControl = new FormControl<string>('', { nonNullable: true });

  private cleanupListeners: (() => void)[] = [];

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    this.searchControl.valueChanges
      .pipe(takeUntilDestroyed(), debounceTime(600), distinctUntilChanged())
      .subscribe((term) => {
        this.onSearch.emit(term);
      });
  }

  isError = computed(() => {
    const control = this.ngControl?.control;
    return !!(control?.invalid && (control?.touched || control?.dirty));
  });

  selectedLabel = computed(() => {
    const current = this.value();
    if (!current) return this.placeholder();
    return typeof current === 'object' ? current[this.labelKey()] : current;
  });

  onScroll(event: Event) {
    const target = event.target as HTMLElement;
    const threshold = 15;
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

    let styles: Record<string, string> = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '2000',
    };

    if (spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow) {
      styles['bottom'] = `${viewportHeight - rect.top + margin}px`;
      styles['top'] = 'auto';
    } else {
      styles['top'] = `${rect.bottom + margin}px`;
      styles['bottom'] = 'auto';
    }

    this.dropdownStyles.set(styles);
  }

  toggle(): void {
    if (this.disabled()) return;
    this.isOpen() ? this.close() : this.open();
  }

  open(): void {
    if (this.isOpen()) return;
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

  clearSearch(event: MouseEvent): void {
    event.stopPropagation();
    this.searchControl.setValue('', { emitEvent: false });
    this.onSearch.emit('');
    this.el.nativeElement.querySelector('input')?.focus();
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
