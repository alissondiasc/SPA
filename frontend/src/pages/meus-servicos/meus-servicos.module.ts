import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MeusServicosPage } from './meus-servicos';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MeusServicosPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(MeusServicosPage),
  ],
})
export class MeusServicosPageModule {}
