import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GoodsService } from '../../services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { IAnyObj, ICourse, IGoods } from '../../models/interfaces';
import { mapAttributes } from '../../models/constans/map-attributes.const';

/**
 * Компонент характеристик продукта
 */
@UntilDestroy()
@Component({
  selector: 'app-goodts-attributes',
  templateUrl: './goodts-attributes.component.html',
  styleUrls: ['./goodts-attributes.component.scss'],
})
export class GoodtsAttributesComponent implements OnInit {

  /** курсы валют */
  public courses: ICourse[] = [];

  /** данные по характеристикам */
  public data!: IAnyObj[];

  /** форм группа */
  public formGroup: FormGroup = new FormGroup({
    id: new FormControl(null),
    price: new FormControl(null),
    course: new FormControl(null),
  });

  /** предыдущее значение курса */
  private prevValue: string | null = null;

  /** текущий курс */
  public currCourse: string | null = null;

  constructor(
    private readonly goodsService: GoodsService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.goodsService.getCourses().pipe(
      untilDestroyed(this)
    ).subscribe((courses: ICourse[]) => {
      this.courses = courses;
      this.subscribeOnSelected();
    });
  }

  /**
   * Подписка на выбранный эл-т меню
   * @private
   */
  private subscribeOnSelected(): void {
    this.goodsService.isSelected$.pipe(
      tap(() => this.formGroup = undefined as any),
      switchMap((value: IGoods | null) => value?.id ? this.goodsService.getProductById(value.id) : of(null)),
      untilDestroyed(this))
      .subscribe((value: IGoods | null) => {
        this.courses = this.courses.map((item: ICourse) => item.name === value?.course ? {
          ...item,
          selected: true
        } : item);

        if (value) {
          this.initFormGroup();
          this.formGroup.patchValue(value);

          this.currCourse = value.course;
          this.data = Object.keys(value).reduce((acc: IAnyObj[], key: string) => {
            if (key === 'id' || key === 'selected' || key === 'course' || key === 'link') return acc;

            acc.push({ label: mapAttributes[key], data: (value as IAnyObj)[key], attribute: key });
            return acc;
          }, []);
          this.prevValue = value.course;

        } else {
          this.data = [];
        }
        this.changeCourse();
        this.changePrice();
        this.cdr.detectChanges();
      });
  }

  /**
   * Подписка на смену курса валюты
   */
  public changeCourse() {
    this.formGroup?.get('course')?.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe((value) => {
      const valuePrice = this.formGroup.get('price')?.value;

      if (this.prevValue === 'RUB') {
        const multiplierNewValue: ICourse | undefined = this.courses.find((item: ICourse) => item.name === value);
        if (multiplierNewValue !== undefined) {
          const newPriceConverted = valuePrice / multiplierNewValue.multiplier;
          this.formGroup.get('price')?.setValue(newPriceConverted.toFixed(2));
        }
      } else {
        const multiplierPrevValue: ICourse | undefined = this.courses.find((item: ICourse) => item.name === this.prevValue);
        const multiplierNewValue: ICourse | undefined = this.courses.find((item: ICourse) => item.name === value);
        if (value === 'RUB') {
          if (multiplierPrevValue !== undefined) {
            const newPriceConverted = valuePrice * multiplierPrevValue.multiplier;
            this.formGroup.get('price')?.setValue(newPriceConverted.toFixed(2));
          }
        } else {
          if (multiplierPrevValue !== undefined && multiplierNewValue !== undefined) {
            const newPriceConverted = valuePrice / multiplierPrevValue.multiplier * multiplierNewValue.multiplier;
            this.formGroup.get('price')?.setValue(newPriceConverted.toFixed(2));
          }
        }
      }

      this.currCourse = this.formGroup.get('course')?.value;

      this.prevValue = value;
      this.updateProduct(this.formGroup.value);
    });
  }

  /**
   * Обновление продукта в БД
   * @private
   */
  private updateProduct(value: Partial<ICourse>): void {
    if (this.formGroup.valid) {
      this.goodsService.updateProduct(value).pipe(
        untilDestroyed(this)
      ).subscribe((value: IGoods) => {
        // console.log(value);
        this.goodsService.updatedProduct(value);
      });
    }
  }

  /**
   * Подписка на изменение цены
   * @private
   */
  private changePrice(): void {
    this.formGroup?.get('price')?.valueChanges.pipe(untilDestroyed(this))
      .subscribe((value: string) => {
        this.updateProduct({...this.formGroup.value, price: value});
      });
  }

  /**
   * Инициализация FG
   * @private
   */
  private initFormGroup(): void {
    this.formGroup = new FormGroup({
      id: new FormControl(null),
      price: new FormControl(null, []),
      course: new FormControl(null),
    });
  }
}
