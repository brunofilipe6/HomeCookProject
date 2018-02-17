import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UnitModel } from '../../recipes/shared/unit.model';

@Pipe({ 
    name: 'abbreviateUnit' 
}) 

/**
 * Displays a friendly date for calendar usage - "Ontem", "Hoje", "Amanhã" plus d MMMM formatted date string.
 */
export class AbbreviateUnitPipe implements PipeTransform { 

    transform(unit: UnitModel, args: string[]) { 
        var abb;
        // TODO check this...
        if (unit.name.indexOf('c.') == 0 || unit.name.indexOf('colher') == 0 ) {
            var words = unit.name.split(" ");
            abb = unit.name.slice(0,1)+'. ' + words[words.length - 1].slice(0,3);
        } else {
            abb = unit.name.slice(0,2);
        }

        return abb;
    }  
}