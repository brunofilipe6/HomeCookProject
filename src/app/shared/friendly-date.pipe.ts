import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ 
    name: 'friendlyDate' 
}) 

/**
 * Displays a friendly date for calendar usage - "Ontem", "Hoje", "Amanhã" plus d MMMM formatted date string.
 */
export class FriendlyDatePipe implements PipeTransform { 

    _sameDay(d1: Date, d2: Date): boolean {
        return (d1.getDate() === d2.getDate()) && (d1.getMonth() === d2.getMonth())
            && (d1.getFullYear() === d2.getFullYear())
    }

    transform(date: Date, args: string[]) { 
        var incremental_date = new Date();
        incremental_date.setDate(incremental_date.getDate()-1);
        if (this._sameDay(date,incremental_date)) {
            return 'Ontem';
        }
        incremental_date.setDate(incremental_date.getDate()+1);
        if (this._sameDay(date,incremental_date)) {
            return 'Hoje';
        }
        incremental_date.setDate(incremental_date.getDate()+1);
        if (this._sameDay(date,incremental_date)) {
            return 'Amanhã';
        }
        // TODO how to get locale?
        return new DatePipe('pt').transform(date, 'd MMMM');
    }  
}