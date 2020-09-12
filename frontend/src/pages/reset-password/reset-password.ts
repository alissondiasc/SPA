import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormControl, FormGroup, AbstractControl } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
/**
 * Generated class for the ResetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})
export class ResetPasswordPage {
    passwordtype: string = 'password';
    cnfpasswordtype: string = 'password';
    cnfpasseye: string = 'eye';
    passeye: string = 'eye';
  public resetSenha;
  public newPwd = {
    antiga: null,
    nova: null
  }
    public confirm_password: AbstractControl;
    public validations_form: FormGroup;
    public matching_passwords_group: FormGroup;
    validation_messages = {
      'senhaAntiga': [
          { type: 'required', message: 'Senha é obrigatório.' },
      ],
      'password': [
        { type: 'required', message: 'Senha é obrigatório.' },
        { type: 'minlength', message: 'Senha teve conter no minimo 8 caracteres.' },
        { type: 'pattern', message: 'Sua senha deve conter no mínimo uma letra maiúscula, uma minúscula e 1 numero.' }
      ],
      'confirm_password': [
          { type: 'required', message: 'Confirmação de senha é obrigatório.' }
      ],
      'matching_passwords': [
          { type: 'areEqual', message: 'Senhas incompatíveis.' }
      ],
    };
    

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public formBuilder: FormBuilder,
              public user: UserProvider,
              public alertController: AlertController,) {
  }
  resetaSenha(){
    this.resetSenha = true
  }
  finalizar(){
    this.resetSenha = false
  }
  ionViewWillLoad() {
    this.matching_passwords_group = new FormGroup({
        password: new FormControl("", Validators.compose([
            Validators.minLength(8),
            Validators.required,
            Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
        ])),
        confirm_password: new FormControl('', Validators.required)
    }, (formGroup: FormGroup) => {
        return this.areEqual(formGroup);
    });
    this.validations_form = this.formBuilder.group({
      senhaAntiga: new FormControl('', Validators.required),
      matching_passwords: this.matching_passwords_group,
  },);

}
managePassword() {
  if (this.passwordtype == 'password') {
      this.passwordtype = 'text';
      this.passeye = 'eye-off';
  } else {
      this.passwordtype = 'password';
      this.passeye = 'eye';
  }
}

  public sendPassWord(){
      if(this.validations_form.valid){
        this.user.resetSEnha(this.newPwd).subscribe(res=>{
          let alerta = this.alertController.create({
            title: 'Confirmação',
            subTitle: 'Senha redefinida com sucesso',
            buttons: ['OK']
          })
          alerta.present()
          alerta.onDidDismiss(data=>{
            this.user.logout();
            this.navCtrl.setRoot(LoginPage);
          })    
      },
      err =>{
        console.log(err)
      }
    );

      }    
   
  }

  fncShowPass(campo) {
    this[campo] = this[campo] == 'password' || this[campo] == null ? 'text' : 'password';
  }

 
  public areEqual(formGroup: FormGroup) {
    let val;
    let valid = true;

    for (let key in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(key)) {
        let control: FormControl = <FormControl>formGroup.controls[key];

        if (val === undefined) {
          val = control.value
        } else {
          if (val !== control.value) {
            valid = false;
            break;
          }
        }
      }
    }

    if (valid) {
      return null;
    }

    return {
      areEqual: true
    };
  }


}
