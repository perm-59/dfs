/** сущность курса валюты */
export interface ICourse {
  /** идентификатор */
  id: string;
  /** наименование */
  name: string;
  /** выбран/не выбран */
  selected: boolean;
  /** множитель */
  multiplier: number;
}
