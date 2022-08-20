import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { GoodsService } from '../../services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Router } from '@angular/router';
import { IGoods } from '../../models/interfaces';

@UntilDestroy()
@Component({
  selector: 'app-menu',
  templateUrl: './goods-menu.component.html',
  styleUrls: ['./goods-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoodsMenuComponent implements OnChanges {

  /** элементы меню */
  @Input() public menuItems: IGoods[] = [];

  constructor(
    private readonly goodsService: GoodsService,
    private readonly router: Router,
  ) {
  }

  /**
   * Выбор строки
   * @param menuItemSelect
   */
  public selectedItem(menuItemSelect: IGoods): void {
    let isSelected = false;
    this.menuItems = this.menuItems.map((item: IGoods) => {
      if (item.id === menuItemSelect.id && !menuItemSelect.selected) {
        isSelected = true;
        return { ...item, selected: true };
      }

      return { ...item, selected: false };
    });


    if (isSelected) {
      this.router.navigate([], {
        queryParams: {
          'index': menuItemSelect.id,
        },
        queryParamsHandling: 'merge'
      })
    } else {
      this.goodsService.updatedProduct(null);
      this.goodsService.onSelected(null);
      this.router.navigate([], {
        queryParams: {
          'index': null,
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  /**
   * Получение текущего пункта меню
   * @param menuItemSelect
   * @private
   */
  private getProduct(menuItemSelect: IGoods): void {
    this.goodsService.getProductById(menuItemSelect.id).pipe(untilDestroyed(this))
      .subscribe((product: IGoods) => {
        this.goodsService.updatedProduct(product);
        this.goodsService.onSelected({ ...product, selected: true });
      });
  }

  public ngOnChanges(): void {
    const selectedMenu = this.menuItems.find((item: IGoods) => item.selected);

    console.log(1);

    if (selectedMenu) {
      this.getProduct(selectedMenu);
    }
  }
}
