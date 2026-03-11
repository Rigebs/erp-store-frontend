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
} from '@angular/forms';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-select-searchable',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectSearchable),
      multi: true,
    },
  ],
  templateUrl: './select-searchable.html',
  styleUrl: './select-searchable.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchable implements ControlValueAccessor, OnDestroy {
  options = input<any[]>([]);
  labelKey = input<string>('label');
  placeholder = input<string>('Seleccionar...');

  private el = inject(ElementRef);
  private document = inject(DOCUMENT);

  value = signal<any>(null);
  isOpen = signal(false);
  disabled = signal(false);
  dropdownStyles = signal<any>({});

  searchControl = new FormControl<string>('', { nonNullable: true });

  private cleanupListeners: (() => void)[] = [];

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
    const dropdownHeight = 300;
    const margin = 8;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;

    let styles: any = {
      position: 'fixed',
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      zIndex: '1100',
    };

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      styles = {
        ...styles,
        bottom: `${viewportHeight - rect.top + margin}px`,
        top: 'auto',
        animation: 'fadeInUp 0.15s ease-out',
      };
    } else {
      styles = {
        ...styles,
        top: `${rect.bottom + margin}px`,
        bottom: 'auto',
        animation: 'fadeInDown 0.15s ease-out',
      };
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
    this.updateDropdownPosition();
    this.isOpen.set(true);

    const scrollHandler = (event: Event) => {
      const isScrollingInside = (event.target as HTMLElement).closest('.options-list');
      if (!isScrollingInside) this.close();
    };

    // Nuevo listener de click global más preciso
    const clickHandler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const clickedInsideTrigger = this.el.nativeElement.contains(target);
      const clickedInsideDropdown = target.closest('.select-dropdown');

      if (!clickedInsideTrigger && !clickedInsideDropdown) {
        this.close();
      }
    };

    this.document.addEventListener('scroll', scrollHandler, true);
    this.document.addEventListener('mousedown', clickHandler); // Usamos mousedown para mayor velocidad
    window.addEventListener('resize', scrollHandler);

    this.cleanupListeners.push(
      () => this.document.removeEventListener('scroll', scrollHandler, true),
      () => this.document.removeEventListener('mousedown', clickHandler),
      () => window.removeEventListener('resize', scrollHandler),
    );
  }

  close(): void {
    this.isOpen.set(false);
    this.cleanupListeners.forEach((fn) => fn());
    this.cleanupListeners = [];
  }

  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.el.nativeElement.contains(event.target);

    const clickedOnDropdown = (event.target as HTMLElement).closest('.select-dropdown');

    if (!clickedInside && !clickedOnDropdown && this.isOpen()) {
      this.close();
    }
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
