import { NgModule } from '@angular/core';
import { InputComponent } from './components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    InputComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    InputComponent
  ]
})
export class UiLibModule { }
