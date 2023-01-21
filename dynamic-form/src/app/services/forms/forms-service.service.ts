import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { form } from 'src/app/models/form-model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class FormsService {

  url: string = environment.urlBase

  constructor(private http: HttpClient) { }
  headers: HttpHeaders = new HttpHeaders({
    "Content-type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "accept": "*"
  });

  /*
  * Metodo getForm utilizado para obtener un JSON del formulario
  * a traves de su ID de tipo number.
  */
  getForm(idForm: number) {
    let url_form = this.url + idForm;
    return this.http.get<form>(url_form, { headers: this.headers });
  }
  /*
  * Metodo sendForm utilizado para enviar un JSON del formulario
  * a traves de su ID de tipo number.
  */
  sendForm(persona: form, idForm: number): Observable<form> {
    let url_form = this.url + idForm;
    return this.http.post<form>(url_form, persona);
  }
}
