import { NgModule } from '@angular/core';
import { ElipseFilterPipe } from './elipse-filter/elipse-filter';
import { NameFilterPipe } from './name-filter/name-filter';
import { OcultDocPipe } from './ocult-doc/ocult-doc';
@NgModule({
	declarations: [
    ElipseFilterPipe,
    NameFilterPipe,
    OcultDocPipe],
	imports: [],
	exports: [ElipseFilterPipe,
    NameFilterPipe,
    OcultDocPipe]
})
export class PipesModule {}
