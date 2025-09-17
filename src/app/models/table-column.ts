import { TemplateRef } from '@angular/core';

export interface TableColumn {
  field: string;
  header: string;
  hidden?: boolean;
  valueFn?: (row: any) => any;
  cellTemplate?: TemplateRef<any>;
}
