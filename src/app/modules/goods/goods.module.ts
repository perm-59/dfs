import { GoodsRoutingModule } from './goods-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  GoodsMenuComponent,
  GoodsGeneralComponent
} from './components';
import { HttpClientModule } from '@angular/common/http';
import { GoodtsAttributesComponent } from './components/goodts-attributes/goodts-attributes.component';
import { GoodsGridComponent } from './components/goods-grid/goods-grid.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiLibModule } from '../../../../projects/ui-lib/src/lib/ui-lib.module';

/** модуль GOODS */
@NgModule({
  declarations: [
    GoodsGeneralComponent,
    GoodsMenuComponent,
    GoodtsAttributesComponent,
    GoodsGridComponent
  ],
  imports: [
    CommonModule,
    GoodsRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    UiLibModule,
  ]
})
export class GoodsModule {
}
