import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormGroup, FormControlName, FormControl, NG_VALIDATORS, AbstractControl, ValidationErrors, Validators, ValidatorFn, AbstractControlOptions } from '@angular/forms';
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
    {
      provide: NG_VALIDATORS,
      useExisting: CustomInputComponent,
      multi: true,
    },
  ],
})
export class CustomInputComponent implements ControlValueAccessor {

  @Input() public validator:  ValidatorFn[] = [];

  input = new FormControl('', [Validators.pattern('[0-9]+(\\.[0-9]{1,2})?%?')])

  @Input() public placeholder: string = '';



  ngOnInit() {
    this.input.valueChanges.subscribe(value => console.log(this.input))
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

  public onTouch: any = () => {}

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    if (control.errors) return {pattern :true}
    return null;
  }
}
