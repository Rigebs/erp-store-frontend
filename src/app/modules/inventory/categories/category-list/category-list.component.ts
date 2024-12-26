import { Component } from '@angular/core';
import { DynamicTableComponent } from '../../../../components/dynamic-table/dynamic-table.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-list',
  imports: [DynamicTableComponent, MatIconModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css',
})
export class CategoryListComponent {}
