import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

/**
 * Компонент инпута
 */
@Component({
  selector: 'ui-input',
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
  styleUrls: ['./input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
  ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {


  /** контрол */
  input = new FormControl('', [Validators.pattern('[0-9]+(\\.[0-9]{1,2})?%?')]);

  /** плейсхолдер */
  @Input() public placeholder: string = '';

  public writeValue(input: string): void {
    this.input.setValue(input);
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
