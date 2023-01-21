import { properties } from './../../models/properties-model';
import { FormsService } from './../../services/forms/forms-service.service';
import { form } from 'src/app/models/form-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-reactive',
  templateUrl: './form-reactive.component.html',
  styleUrls: ['./form-reactive.component.scss'],
})
export class FormReactiveComponent implements OnInit {

  public myForm: FormGroup = this.formBuilder.group({})
  public form: form = {};
  public isResponseButton: boolean = false;
  public showAlertSuccess: boolean = false;
  public showAlertError: boolean = false;
  public showAlertErrorFatal: boolean = false;
  public showLoading: boolean = true;
  public numberForm: number = 3;

  constructor(private formBuilder: FormBuilder,
    private formService: FormsService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getForm();
  }

  /*
  * Metodo getForm utilizado obtener el formulario desde una peticion tipo GET
  */
  private getForm() {
    this.formService.getForm(this.numberForm).subscribe({
      next: data => {
        this.form = data;
        if (this.form.properties) {
          this.createForm(this.form.properties);
        }
      },
      error: error => {
        this.showAlertErrorFatal = true;
      }
    })
  }

  /*
  * Metodo createForm utilizado para crear inicialmente el formulario a traves de las
  * propiedades del formulario
  */
  createForm(controls: properties) {
    for (const [key, value] of Object.entries(controls)) {
      const validatorsToAdd = [];
      if (this.verificateRequired(key)) {
        validatorsToAdd.push(Validators.required);
      }
      if (value.pattern) {
        validatorsToAdd.push(Validators.pattern(value.pattern));
      }
      if (value.format == 'email') {
        validatorsToAdd.push(Validators.email);
      }
      if (value.type == 'boolean' && value.value == null) {
        value.value = false;
      }
      this.myForm.addControl(
        key,
        this.formBuilder.control((value.value ? value.value : (value.default ? value.default : null)), validatorsToAdd)
      );
    }
    this.showLoading = false;
  }


  /*
  * Metodo setForm utilizado para modificar los valores iniciales del formulario a traves de las
  * propiedades del formulario
  */
  setForm(controls: properties) {
    for (const [key, value] of Object.entries(controls)) {
      if (value.format == "datetime") {
        (this.myForm.get(key))?.setValue(this.deletedtoISOString((value.value).toString()));
      } else {
        (this.myForm.get(key))?.setValue(value.value);
      }
    }
    this.showLoading = false;
  }

  /*
  * Metodo verificateRequired utilizado para verificar los valores requeridos del formulario a traves de las
  * propiedades del formulario
  */
  verificateRequired(key: string) {
    var isRequired = false;
    this.form.required?.forEach((element) => {
      if (element == key) {
        isRequired = true;
      }
    })
    return isRequired;
  }
    /*
  * Metodo onSubmit utilizado para verificar los valores ingresados en el formulario a traves de las
  * propiedades del formulario y enviar a traves de una petición POST el mismo, en tal caso de ocurrir
  * algun error, se muestran los respectivos mensajes. 
  */
  onSubmit() {
    this.showLoading = true;

    if (this.myForm.valid && this.form.properties) {
      for (const [keyForm, valueForm] of Object.entries(this.myForm.value)) {
        for (const [key, value] of Object.entries(this.form.properties)) {
          console.log(key + " == " + keyForm + '&&' + (valueForm || (!valueForm && value.type == 'boolean')));
          if (key == keyForm && valueForm != null) {
            if ((value.type == "string" && value.format != "datetime") || value.type == "integer") {
              value.value = valueForm.toString();
              break;
            }
            if (value.type == "string" && value.format == "datetime") {
              value.value = this.addtoISOString(valueForm.toString());
              break;
            }
            if (value.format == "float") {
              value.value = parseFloat(valueForm.toString());
              break;
            }
            if (value.type == "boolean") {
              if (valueForm.toString().toLowerCase() == 'true') {
                value.value = true;
                break;
              } else {
                value.value = false;
                break;
              }

            }
          }
        }
      };
      this.formService.sendForm(this.form, this.numberForm).subscribe({
        next: data => {
          this.showAlertSuccess = true;
          this.isResponseButton = this.validateResponse(data);
          this.form = data;
          if (this.form.properties) {
            this.createForm(this.form.properties);
          }
        },
        error: error => {
          if (error.status == '400') {
            this.showAlertError = true;
            this.form = error.error;
            if (this.form.properties) {
              this.setForm(this.form.properties);
            }
          } else {
            this.showAlertErrorFatal = true;
          }
          this.showLoading = false;
        }
      })
    } else {
      this.showAlertError = true;
      this.showLoading = false;
    }
  }

  /*
  * Metodo getPattern utilizado para obtener los valores pattern del formulario a traves de las
  * propiedades del formulario setear su información y agregarla a los campos
  */
  getPattern(pattern: string | null): RegExp {
    var regexPattern: RegExp;
    if (pattern) {
      regexPattern = new RegExp(pattern);
      return regexPattern;
    } else {
      regexPattern = new RegExp('^.+');
      return regexPattern;
    }
  }
  /*
  * Metodo validateResponse utilizado validar el tipo de respuesta del formulario tipo POST
  */
  validateResponse(data: form): boolean {
    if (data.properties) {
      for (const [key, value] of Object.entries(data.properties)) {
        if (value.type == 'button') {
          return true;
        }
      }
    }
    return false;
  }

  /*
  * Metodo addtoISOString utilizado para agregar formato tipo ISO al datetime
  */
  addtoISOString(date: string) {
    return date.concat('Z');
  }
  
  /*
  * Metodo addtoISOString utilizado para eliminar formato tipo ISO al datetime
  */
  deletedtoISOString(date: string) {
    return date.replace('Z', '');
  }
}