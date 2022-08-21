import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { GoodsService } from '../../services';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { IGoods } from '../../models/interfaces';

/**
 * Компонент грида
 */
@UntilDestroy()
@Component({
  selector: 'app-goods-grid',
  templateUrl: './goods-grid.component.html',
  styleUrls: ['./goods-grid.component.scss']
})
export class GoodsGridComponent implements OnInit {

  /** данные таблицы */
  public tableData: IGoods[] | null = null;

  /** состояние загрузки данных в таблицу */
  public state: 'loading' | 'loaded' | 'noData' | 'notSelected' = 'notSelected';

  public selectedIndex: number | null = null;

  constructor(
    private readonly goodsService: GoodsService,
  ) {
  }

  ngOnInit(): void {
    this.goodsService.isUpdated$.pipe(
      tap((item: IGoods | null) => this.state = item ? 'loading' : 'notSelected'),
      switchMap((value: IGoods | null) => value?.category ? this.goodsService.getProductByCategory(value.category) : of(null)),
      untilDestroyed(this)
    )
      .subscribe((goods: IGoods[] | null) => {
        if (this.state !== 'notSelected') {
          this.state = goods?.length ? 'loaded' : 'noData';
          this.tableData = goods;
        }
      });
  }

  /**
   * Выбор строки таблицы
   * @param index индекс выбранной строки
   */
  public onSelectedRow(index: number): void {
    if (index === this.selectedIndex) {
      this.selectedIndex = null;
    } else {
      this.selectedIndex = index;
    }
  }

  /**
   * Клик по ссылке
   * @param event событие
   */
  public selectLink(event: MouseEvent): void {
    event.stopPropagation();
  }
}
