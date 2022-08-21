import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

/**
 * Кастомный инпут
 */
@Component({
  selector: 'app-custom-input',
  template: `
    <div class="block">
      <input type="text"
             [placeholder]="placeholder"
             [formControl]="input"
             (blur)="onTouch()">
      <div *ngIf="input?.errors" class="item__error">
        Не корректные данные
      </div>
    </div>

  `,
  styleUrls: ['./custom-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomInputComponent,
      multi: true,
    },
  ],
})
export class CustomInputComponent implements OnInit, ControlValueAccessor {


  /** контрол */
  input = new FormControl('', [Validators.pattern('[0-9]+(\\.[0-9]{1,2})?%?')]);

  /** плейсхолдер */
  @Input() public placeholder: string = '';

  ngOnInit() {
    this.input.valueChanges.subscribe(value => console.log(this.input));
  }

  public writeValue(input: string): void {
    this.input.setValue(input);
    console.log(this.input);
  }

  private subscriptions: any[] = [];

  public registerOnChange(fn: any): void {
    this.subscriptions.push(
      this.input.valueChanges.subscribe(fn)
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  public onTouch: any = () => {
  };

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
