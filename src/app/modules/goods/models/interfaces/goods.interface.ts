/**
 * сущность продукта
 */
export interface IGoods {
  /** идентификатор */
  id: string;
  /** курс */
  course: string;
  /** категория */
  category: string;
  /** наименование */
  name: string;
  /** цена */
  price: number;
  /** выбран/не выбран */
  selected: boolean;
  /** ссылка на продукт */
  link: string;
}
