import { Component } from '@angular/core';

import { Feature } from './feature.model';

@Component({
  selector: 'features',
  template: require('./features.html')
})
export class Features {
  features: Feature[];

  ngOnInit() {
    this.features = [
      new Feature(
        1, 
        'Planeia as tuas refeições', 
        'assets/images/brocoli.png', 
        'Primeiro, escolhe o que vais comer ao longo da semana. Podes pesquisar na nossa biblioteca de receitas - mantida impecável pela nossa equipa de provedores de receitas. '
      ),
      new Feature(
        2, 
        'Usa a lista de compras', 
        'assets/images/cabbage.png', 
        'Adere à versão Premium para usares a lista de compras para saber o que de facto tens de comprar quando fores ao supermercado.'
      ),
      new Feature(
        3, 
        'Descontos nos planos alimentares', 
        'assets/images/beet.png', 
        'Adere à versão Premium para teres descontos nos planos alimentares construídos pelos nossos provedores de receitas. Depois de comprares um plano alimentar, podes reutilizá-lo quantas vezes quiseres.'
      ),
      new Feature(
        4, 
        'Sugestões adequadas ao teu perfil', 
        'assets/images/tomato.png', 
        'Adere à versão Premiun para teres acesso a recomendações de receitas baseadas nas tuas preferências alimentares, gostos, e no que tens comido ultimamente.'
      )
    ];
  }
}