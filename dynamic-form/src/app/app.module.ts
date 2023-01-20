import { FormsService } from './services/forms/forms-service.service';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule } from "@angular/forms"
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NgxPatternModule } from 'ngx-pattern';
import { FormReactiveComponent } from './components/form-reactive/form-reactive.component';
import { ControlErrorsComponent } from './components/control-errors/control-errors.component';
@NgModule({
  declarations: [
    AppComponent,
    FormReactiveComponent,
    ControlErrorsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPatternModule
  ],
  providers: [FormsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
