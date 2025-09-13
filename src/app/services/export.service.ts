import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  private readonly backendUrl = `${environment.NG_APP_URL_API_GENERAL}`;

  constructor(private http: HttpClient) {}

  exportStock(data: any[], format: 'excel' | 'pdf') {
    const threshold = 5000;

    if (data.length > threshold) {
      this.exportBackend(data, format);
    } else {
      if (format === 'excel') {
        this.exportExcelFrontend(data);
      } else if (format === 'pdf') {
        this.exportPdfFrontend(data);
      }
    }
  }

  private exportBackend(data: any[], format: 'excel' | 'pdf') {
    const url = `${this.backendUrl}/stocks/export?format=${format}`;
    this.http.post(url, data, { responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = `stocks.${format === 'excel' ? 'xlsx' : 'pdf'}`;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  private exportExcelFrontend(data: any[]) {
    const mapped = data.map((item) => ({
      Producto: item.product?.name || '',
      SKU: item.sku || '',
      Categoria: item.category?.name || '',
      Almacen: item.warehouse?.name || '',
      Cantidad: item.quantity,
      StockMinimo: item.minQuantity,
      Estado: item.quantity < item.minQuantity ? 'Bajo' : 'OK',
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mapped);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stock');
    XLSX.writeFile(wb, 'stocks.xlsx');
  }

  private exportPdfFrontend(data: any[]) {
    const doc = new jsPDF();

    const mapped = data.map((item) => ({
      Producto: item.product?.name || '',
      SKU: item.sku || '',
      Categoria: item.category?.name || '',
      Almacen: item.warehouse?.name || '',
      Cantidad: item.quantity,
      StockMinimo: item.minQuantity,
      Estado: item.quantity < item.minQuantity ? 'Bajo' : 'OK',
    }));

    autoTable(doc, {
      head: [Object.keys(mapped[0] || {})],
      body: mapped.map((d) => Object.values(d)),
    });

    doc.save('stocks.pdf');
  }
}
