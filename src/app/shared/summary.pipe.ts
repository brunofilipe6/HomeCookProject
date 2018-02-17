import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({ 
    name: 'summary' 
}) 

/**
 * Displays a friendly date for calendar usage - "Ontem", "Hoje", "Amanhã" plus d MMMM formatted date string.
 */
export class SummaryPipe implements PipeTransform { 


    transform(str: string, arg: string) { 

        var limit = 50;
        if (typeof arg!== "undefined") {
            limit = parseInt(arg);
        }
        return str.substr(0, limit);
    }  
}