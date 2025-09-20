export interface DashboardSummary {
  salesKpis: SalesSummary;
  topProducts: TopProduct[];
  lowStock: LowStock[];
  topCustomers: TopCustomer[];
  salesByCashier: SalesByCashier[];
}

export interface SalesSummary {
  totalSales: number;
  totalTransactions: number;
  avgTicket: number;
  salesByDate: SalesByDate[];
}

export interface SalesByDate {
  date: string; // YYYY-MM-DD
  total: number;
}

export interface TopProduct {
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface LowStock {
  productName: string;
  stock: number;
}

export interface TopCustomer {
  customerName: string;
  purchases: number;
  totalSpent: number;
}

export interface SalesByCashier {
  cashierName: string;
  totalSales: number;
}
