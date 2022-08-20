import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICourse, IGoods } from '../models/interfaces';

/**
 * Сервис по работе с продуктами
 */
@Injectable({
  providedIn: 'root'
})
export class GoodsService {

  /** урл для продуктов */
  private urlProduct: string = '/products';
  /** урл для курсов валют */
  private urlCourses: string = '/courses';

  /** Позволяет следить за выбранным пунктом меню */
  private isSelected: Subject<IGoods | null> = new Subject<IGoods | null>();
  public isSelected$: Observable<IGoods | null> = this.isSelected.asObservable();

  /** Позволяет следить в таблице за выбранным эл-ом */
  private isUpdated: Subject<IGoods | null> = new Subject<IGoods | null>();
  public isUpdated$: Observable<IGoods | null> = this.isUpdated.asObservable();


  constructor(
    private readonly httpClient: HttpClient
  ) {
  }

  /**
   * Получение всех продуктов
   */
  public getProducts(): Observable<IGoods[]> {
    return this.httpClient.get<IGoods[]>(this.urlProduct);
  }

  /**
   * Получение типов курсов валют
   */
  public getCourses(): Observable<ICourse[]> {
    return this.httpClient.get<ICourse[]>(this.urlCourses);
  }

  /**
   * Метод выбора элемента меню
   * @param row выбранная строка
   */
  public onSelected(row: IGoods | null): void {
    this.isSelected.next(row);
  }

  /**
   * обновленный продукт
   * @param product продукт
   */
  public updatedProduct(product: IGoods | null): void {
    this.isUpdated.next(product);
  }

  /**
   * Обновление продукта в БД
   * @param value значение формы
   * @returns сущность обновленного продукта
   */
  public updateProduct(value: Partial<IGoods>): Observable<IGoods> {
    return this.httpClient.patch<IGoods>(`${this.urlProduct}/${value.id}`, { ...value, price: value.price ? +value.price : null });
  }

  /**
   * Получение продукта по идентификатору
   * @param id идентификатор продукта
   * @returns сущность продукта
   */
  public getProductById(id: string): Observable<IGoods> {
    return this.httpClient.get<IGoods>(`${this.urlProduct}/${id}`);
  }

  /**
   * Получение продуктов по категории выбранного продукта
   * @param category категория
   * @returns массив продуктов
   */
  public getProductByCategory(category: string): Observable<IGoods[]> {
    return this.httpClient.get<IGoods[]>(`${this.urlProduct}?q=${category}`)
  }
}
