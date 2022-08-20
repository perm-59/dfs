import { Component, OnInit } from '@angular/core';
import { GoodsService } from '../../services';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { IGoods } from '../../models/interfaces';

/**
 * Общий компонент содержащий меню, инфо, грид
 */
@UntilDestroy()
@Component({
  selector: 'app-general',
  templateUrl: './goods-general.component.html',
  styleUrls: ['./goods-general.component.scss']
})
export class GoodsGeneralComponent implements OnInit {

  /** пункты меню */
  public menuItems: IGoods[] = [];

  constructor(
    private readonly goodsService: GoodsService,
    private readonly route: ActivatedRoute,
  ) {
  }

  public ngOnInit(): void {
    combineLatest([
      this.route.paramMap,
      this.route.queryParams.pipe(
        map((params: Params) => {
          if (params.index) {
            return { id: params.index };
          }
          return null;
        }))
    ]).pipe(untilDestroyed(this))
      .subscribe(([paramMap, query]: [ParamMap, { id: string } | null]) => {
        this.goodsService.getProducts().subscribe((goods: IGoods[]) => {
          if (query) {
            goods = goods.map((item: IGoods) => ({ ...item, selected: item.id === query.id }));
          }
          this.menuItems = goods;
        });
      });
  }
}
