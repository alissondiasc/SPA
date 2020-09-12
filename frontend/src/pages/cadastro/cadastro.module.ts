import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CadastroPage } from './cadastro';
import { TextMaskModule } from 'angular2-text-mask';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    CadastroPage,
  ],
  imports: [
    IonicPageModule.forChild(CadastroPage),
    TextMaskModule,
    BrMaskerModule
    
  ],
})
export class CadastroPageModule {}
