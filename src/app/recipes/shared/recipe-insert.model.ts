
export class RecipeInsert{

  constructor(
      public id: number,
      public name: String,
      public description: String,
      public image: String,
      public servings: number,
      public price: number,
      public time: number,
      public difficulty: number,
      public userId: number,
      public isBreakfast: number // 1 é Pequeno-almolo, 2 não é
      ) { }
}
