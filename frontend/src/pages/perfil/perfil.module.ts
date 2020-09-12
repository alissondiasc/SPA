import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PerfilPage } from './perfil';
import { Ionic2RatingModule } from 'ionic2-rating';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PerfilPage,
  ],
  imports: [
    Ionic2RatingModule,
    PipesModule,
    IonicPageModule.forChild(PerfilPage),
  ],
})
export class PerfilPageModule {}
