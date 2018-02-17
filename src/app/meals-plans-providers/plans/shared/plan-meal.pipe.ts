import { Pipe, PipeTransform } from '@angular/core';
import { PlanMealModel } from './plan-meal.model';

@Pipe({
  name: 'planmealpipe',
  pure: false
})

export class PlanMealPipe implements PipeTransform {
  transform(meals: PlanMealModel[], args: String): PlanMealModel[] {
    return meals.filter(item => item.mealTime.toLowerCase() == args.toLowerCase());
  }
}