import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';

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
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.css',
})
export class DynamicTableComponent implements OnInit {
  @Input() columns: { field: string; header: string; hidden?: boolean }[] = [];
  @Input() data: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  ngOnInit(): void {
    this.updateDisplayedColumns();
    this.dataSource = new MatTableDataSource(this.data);
  }

  updateDisplayedColumns(): void {
    this.displayedColumns = [
      'index', // Mantén la columna fija de índice
      ...this.columns.filter((col) => !col.hidden).map((col) => col.field),
      'actions', // Mantén la columna fija de acciones
    ];
  }

  toggleColumnVisibility(column: { field: string; hidden?: boolean }): void {
    column.hidden = !column.hidden;
    this.updateDisplayedColumns();
  }

  onEdit(element: any): void {
    console.log('Editar:', element);
  }

  onDelete(element: any): void {
    console.log('Eliminar:', element);
  }

  onToggleStatus(element: any): void {
    if (element.status === 'A') {
      element.status = 'I';
      console.log('Elemento desactivado:', element);
    } else {
      element.status = 'A';
      console.log('Elemento activado:', element);
    }
    this.dataSource.data = [...this.dataSource.data];
  }
}
