import { BrandDto } from './brand-dto';
import { CategoryDto } from './category-dto';
import { ImageDto } from './image-dto';
import { LineDto } from './line-dto';
import { SupplierDto } from './supplier-dto';
import { UnitMeasureDto } from './unit-measure-dto';

export interface ProductDto {
  id: number;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  status: boolean;
  flag: boolean;
  image: ImageDto;
  brand: BrandDto;
  category: CategoryDto;
  unitMeasure: UnitMeasureDto;
  line: LineDto;
  supplier: SupplierDto;
}
