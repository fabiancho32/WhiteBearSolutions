import { property } from './../../models/property-model';
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

  constructor(private formBuilder: FormBuilder,
    private formService: FormsService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.getForm();
  }

  private getForm() {
    this.formService.getForm(1).subscribe({
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

  createForm(controls: properties) {
    for (const [key, value] of Object.entries(controls)) {
      const validatorsToAdd = [];
      console.log(key, value);
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
        this.formBuilder.control((value.value ? value.value : (value.default ? value.default : null)), validatorsToAdd)
      );
    }
    this.showLoading = false;
  }

  setForm(controls: properties) {
    for (const [key, value] of Object.entries(controls)) {
      if (value.format = "datetime") {
        (this.myForm.get(key))?.setValue(this.deletedtoISOString((value.value).toString()));
      } else {
        (this.myForm.get(key))?.setValue(value.value);
      }
    }
    this.showLoading = false;
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
    this.showLoading = true;

    if (this.myForm.valid && this.form.properties) {
      for (const [keyForm, valueForm] of Object.entries(this.myForm.value)) {
        for (const [key, value] of Object.entries(this.form.properties)) {
          
          if (key == keyForm && valueForm) {
            //console.log('key = '+key,' keyForm = '+keyForm,'valueForm = '+valueForm);
            console.log('type = '+value.type,' format = '+value.format,'valueForm = '+valueForm);
            if ((value.type == "string" && value.format != "datetime") || value.type == "integer") {
              value.value = valueForm.toString();
              break;
            } else if (value.type == "string" && value.format == "datetime") {
              value.value = this.addtoISOString(valueForm.toString());
              break;
            } else if (value.type == "number" && value.format == "float") {
              value.value = parseInt(valueForm.toString(), 10);
              break;
            } else if (value.type == "boolean") {
              if (valueForm.toString().toLowerCase() == 'true') {
                value.value = true;
              } else {
                value.value = false;
              }
              break;
            }
          }
        }
      };
      this.formService.sendForm(this.form, 1).subscribe({
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

  onNavigate(button: property) {
    alert('hola!');
    this.router.navigateByUrl((button.value).toString());
  }

  addtoISOString(date: string) {
    return date.concat('Z');
  }
  deletedtoISOString(date: string) {
    return date.replace('Z', '');
  }
}