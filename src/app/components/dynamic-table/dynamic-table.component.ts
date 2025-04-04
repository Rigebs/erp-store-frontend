import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
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
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
    MatPaginator,
    MatButtonModule,
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css',
})
export class DynamicTableComponent implements OnInit {
  @Input() columns: { field: string; header: string; hidden?: boolean }[] = [];
  @Input() data: any[] = [];

  @Input() total: number = 0;
  @Input() page: number = 0;

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() toggleStatus = new EventEmitter<any>();

  @Output() pageChange = new EventEmitter<{ items: number; page: number }>();

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<any>;

  constructor() {
    this.dataSource = new MatTableDataSource<any>(this.data);
  }

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.dataSource.data = this.data;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'index',
      ...this.columns.filter((col) => !col.hidden).map((col) => col.field),
      'actions',
    ];
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

  onToggleStatus(element: any): void {
    this.toggleStatus.emit(element);
  }
}
