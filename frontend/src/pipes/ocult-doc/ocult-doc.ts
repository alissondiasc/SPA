import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the OcultDocPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'ocultDoc',
})
export class OcultDocPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(input, size) {
    
    if( !input || input.length <= size)return input;
    
    var output  =  "***********" +input.substring(6,(size|| 2));
    
    return output;
  };
}
