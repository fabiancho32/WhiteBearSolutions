import { properties } from './../../models/properties-model';
import { FormsService } from './../../services/forms/forms-service.service';
import { form } from 'src/app/models/form-model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-form-reactive',
  templateUrl: './form-reactive.component.html',
  styleUrls: ['./form-reactive.component.scss'],
})
export class FormReactiveComponent implements OnInit {

  public myForm: FormGroup = this.formBuilder.group({})
  public form: form = {};


  constructor(private formBuilder: FormBuilder,
    private formService: FormsService) { }

  ngOnInit(): void {
    this.getForm();
  }


  private getForm() {
    this.formService.getForm(3).subscribe({
      next: data => {
        this.form = data;
        if (this.form.properties) {
          this.createForm(this.form.properties);
        }
      },
      error: error => {
        alert('Lo sentimos ha ocurrido un error intente nuevamente mas tarde...! ' + error.message);
      }
    })
  }

  createForm(controls: properties) {
    for (const [key, value] of Object.entries(controls)) {
      const validatorsToAdd = [];
      console.log(key,value);
      if (this.verificateRequired(key)) {
        validatorsToAdd.push(Validators.required);
      }
      if (value.pattern) {
        validatorsToAdd.push(Validators.pattern(value.pattern));
      }
      if (value.format == 'email') {
        validatorsToAdd.push(Validators.email);
      }
      this.myForm.addControl(
        key,
        this.formBuilder.control((value.value ? value.value : (value.default? value.default : null)), validatorsToAdd)
      );
    }
  }

  validateNum(event: number) {
    if (event >= 48 && event <= 57) {
      return true;
    }
    return false;
  }




  verificateRequired(key: string) {
    var isRequired = false;
    this.form.required?.forEach((element) => {
      if (element == key) {
        isRequired = true;
      }
    })
    return isRequired;
  }
  onSubmit() {
    console.log('Form valid: ', this.myForm.valid);
    console.log('Form values: ', this.myForm.value);
    console.log('Form values: ', this.myForm.invalid);

    this.formService.sendForm(this.form,1).subscribe({
      next: data => {
        alert("Ha sido enviado el formulario correctamente.");
        this.form = data;
      },
      error: data => {
        this.form = data;
      }
    })
  }
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
  

}