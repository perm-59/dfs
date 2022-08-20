import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: '**', redirectTo: 'port/goods', pathMatch: 'full' },
      {
        path: 'port/goods',
        loadChildren: () => import('./modules/goods/goods.module').then((m) => m.GoodsModule)
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
