import { Directive , Renderer , ElementRef} from '@angular/core';

/**
 * Generated class for the AutoHideDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[auto-hide]',
  host: {'(ionScroll)' : '(onScrollContent($event))' }
})
export class AutoHideDirective {
 
  fabToHide;
  oldScrollTop:number = 0;

  constructor( private renderer: Renderer, private elementRef: ElementRef) {
   
  }
  ngOnInit(){
    this.fabToHide=this.elementRef.nativeElement.getElementsByClassName("fab")[0];
    this.renderer.setElementStyle(this.fabToHide,"webkitTransition", "trasnform 500ms, opacity 500ms")
  }
  
  
  onScrollContent(e){
   
   if(e.scrollTop - this.oldScrollTop > 10){
     
     this.renderer.setElementStyle(this.fabToHide, "opacity", "0");
     this.renderer.setElementStyle(this.fabToHide, "webkitTransform", "scale3d(.1,.1,.1)");
   }else if(e.scrollTop - this.oldScrollTop <0){
     
     this.renderer.setElementStyle(this.fabToHide, "opacity", "1");
     this.renderer.setElementStyle(this.fabToHide, "webkitTransform", "scale3d(1,1,1)");
   }
   this.oldScrollTop = e.scrollTop;
  }
  
}
