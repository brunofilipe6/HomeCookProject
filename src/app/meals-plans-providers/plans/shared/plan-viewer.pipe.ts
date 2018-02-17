import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ 
    name: 'planViewerPipe',
    pure: false
})

export class PlanViewerPipe implements PipeTransform{
    transform(planDescription: String, args: number): String{
        var limit = (args) ? args : 30;
        if(planDescription && planDescription.length > limit){
          return planDescription.substring(0,limit) + "...";
        }
        return planDescription;
    }
}