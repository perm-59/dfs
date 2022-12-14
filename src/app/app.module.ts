import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { UiLibModule } from '../../projects/ui-lib/src/lib/ui-lib.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    UiLibModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
