import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FilterInputComponent } from '../filter-input/filter-input.component';
import { TableColumn } from '../../models/table-column';

@Component({
  selector: 'app-dynamic-table',
  imports: [
    MatTableModule,
    MatInputModule,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatMenuModule,
    MatChipsModule,
    MatPaginatorModule,
    MatButtonModule,
    FilterInputComponent,
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css',
})
export class DynamicTableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() total: number = 0;
  @Input() page: number = 0;

  @Input() actionsTemplate?: TemplateRef<any>;
  @Input() filterActionsTemplate?: TemplateRef<any>;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggleEnabled = new EventEmitter<any>();
  @Output() pageChange = new EventEmitter<{ items: number; page: number }>();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  availableActions: string[] = [];

  constructor() {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.dataSource.data = this.data;

    this.availableActions = [];
    if (this.toggleEnabled.observed)
      this.availableActions.push('toggleEnabled');
    if (this.edit.observed) this.availableActions.push('edit');
    if (this.delete.observed) this.availableActions.push('delete');

    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const lowerFilter = filter.trim().toLowerCase();

      return this.columns
        .filter((col) => !col.hidden)
        .some((col) => {
          let value: any;

          if (col.valueFn) {
            try {
              value = col.valueFn(data);
            } catch {
              value = null;
            }
          } else {
            value = this.getNestedValue(data, col.field);
          }

          return value !== undefined && value !== null
            ? value.toString().toLowerCase().includes(lowerFilter)
            : false;
        });
    };
  }

  onPageChange(event: PageEvent) {
    this.pageChange.emit({ items: event.pageSize, page: event.pageIndex });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.dataSource.data = this.data;
    }
    if (changes['columns'] && !changes['columns'].firstChange) {
      this.updateDisplayedColumns();
    }
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path
      .split('.')
      .reduce((prev, curr) => (prev ? prev[curr] : undefined), obj);
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = this.columns
      .filter((col) => !col.hidden)
      .map((col) => col.field);

    if (this.availableActions.length > 0 || this.actionsTemplate) {
      this.displayedColumns.push('actions');
    }
  }

  toggleColumnVisibility(column: { field: string; hidden?: boolean }): void {
    column.hidden = !column.hidden;
    this.updateDisplayedColumns();
  }

  onEdit(element: any): void {
    this.edit.emit(element);
  }

  onDelete(element: any): void {
    this.delete.emit(element);
  }

  onToggleEnabled(element: any): void {
    this.toggleEnabled.emit(element);
  }
}
