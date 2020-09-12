import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroDadosProfissionaisPage } from './cadastro-dados-profissionais';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { Ionic2RatingModule } from 'ionic2-rating';

@NgModule({
  declarations: [
    CadastroDadosProfissionaisPage,
  ],
  imports: [

    BrMaskerModule,
    Ionic2RatingModule,
    IonicPageModule.forChild(CadastroDadosProfissionaisPage),
  ],
})
export class CadastroDadosProfissionaisPageModule {}
