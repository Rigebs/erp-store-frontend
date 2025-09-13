export interface MenuItem {
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[]; // permite anidación
  isSection?: boolean; // para marcar un padre "sección"
}
