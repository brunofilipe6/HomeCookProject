# HomeCook

## How to run the application:
1. run `npm i -g webpack webpack-dev-server`
2. run `npm install` 
3. run `npm start`
4. Open browser at `localhost:3000`

---

## Style Guideline [link](https://angular.io/styleguide)

The following are suggestions on how we should build the application. These are not rules but suggestions highly followed by the Angular community.

### 1. Single responsibility principle [link](https://en.wikipedia.org/wiki/Single_responsibility_principle)

1. Apply the principle to all components, services.
This helps make the app cleaner, easier to read, maintain and test.
2. Write small functions.

### 2. Separate file names with Dots and Dashes (to provide a consistent way to quickly identify and reference assets).

| Symbol Name     | File Name           | Selector            |
|-----------------|---------------------|---------------------|
| RecipeComponent | recipe.component.ts | \<recipe>\</recipe> |
| RecipeModule    | recipe.module.ts    |                     |
| RecipeService   | recipe.service.ts   |                     |

### 3. Unit Test File Names (currently not in use)
Name test specification files with a suffix of `.spec`.

| File Name           | Spec                     |
|---------------------|--------------------------|
| recipe.component.ts | recipe.component.spec.ts |

### 4. End to End Test File Names (currently not in use)
Name end-to-end test specification files with a suffix of `.e2e-spec`.

| File Name           | E2E Spec                     |
|---------------------|------------------------------|
| recipe.component.ts | recipe.component.e2e.spec.ts |

### 5. Use Upper camel case when naming classes.
_Example_: RecipeComponent

### 6. Declare variables with const if their values should not change during the application lifetime.
_Example_:

```js
const immutableVariable: String = 'localhost:8080/api/v1';
```

### 7. Variables, properties and methods should be camel cased. Use `_' prefix for private objects.
_Example_:

```js
let variable;
this.publicProperty;
this.publicMethod();
this.privateMethod();
this._privateProperty;
```

### 8. Import Line Spacing
Consider leaving one empty line between third party imports and application imports.
_Example_:

```js
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { RecipeComponent } from './recipe.component';
import { Recipe } from './recipe.model';
```

### 9. Decorate Input and Output Properties Inline
Use `@Input` and `@Output` instead of the inputs and outputs properties of the Component decorator.

_Example_:

```js
@Component({
    selector: 'recipe'
})
export class RecipeComponent {
    @Input() recipe: Recipe;
    @Output() change = new EventEmitter<any>();
}
```

### 10. Avoid Renaming Inputs and Outputs
Avoid renaming inputs and outputs, when possible:
```js
    @Input('recipeInput') recipe: Recipe;
```

### 11. Member sequence
Follow the style:
```js
export class RecipeComponent implements OnInit {
  // public properties
  name: String;

  // private fields
  _controlVarible: Number;

  // public angular2 methods
  ngOnInit() { ... }

  // public methods
  publicMethod() { ... }

  // private methods
  private privateMethod() { ... }
}
```

### 12. Put Presentation Logic in the Component Class

```js
@Component({
  selector: 'ingredient-usage',
  template: `{{total}}`
})
export class IngredientUsage {
  quantity: Number;
  multiplier: Number;

  get total() {
    return this.quantity * this.multiplier;
  }
}
```

### 13. Folder structure

```html
<root>
    <app>
        <recipes>
            <recipe-detail>
                recipe.component.ts|html|css
            </recipe-detail>
            <recipe-list>
                recipe-list.component.ts|html|css
            </recipe-list>
            <recipe-preview>
                recipe-preview.component.ts|html|css
            </recipe-preview>
            <shared>
                recipe.model.ts
                recipe.service.ts
            </shared>
        </recipes>
        
        <users>
            <auth>
                auth.component.ts|html|css
            </auth>
            <shared>
                auth.service.ts
                auth.guard.ts
            </shared>
        </users>
        
        <shared>
            auth.guard.ts
        </shared>
    </app>
</root>
```

## Arquitetura geral do sistema:

* Landing page:
    * [R] .../landing
    * [C] Landing
* Página de login:
    * [R] .../login
    * [C] Users
* Página de registo:
    * [R] .../register
    * [C] Users
* Página da minha conta:
    * [R] .../account
    * [C] Users
* Página de planeador:
    * [R] .../planner
    * [C] Planner -> [C] Day -> [C] MealHolder: 
        
        if (has_meal) {
            [C] MealViewer -> [C] Meal 
        } else { 
            mostrar adicionar refeição
        }
* Página de pesquisa:
    * [R] .../search
    * [C] Search -> [C] MealViewer -> [C] Meal
* Página de lista de compras
    * [R] .../shopping-list
    * TODO !!
* Componentes extra:
    * [C] Navbar.
