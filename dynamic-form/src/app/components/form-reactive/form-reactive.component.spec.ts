import { properties } from './../../models/properties-model';

import { FormsService } from './../../services/forms/forms-service.service';
import { NgxPatternModule } from 'ngx-pattern';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './../../app-routing.module';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormReactiveComponent } from './form-reactive.component';
import { FormsTestingService } from 'src/test/form-testing';


describe('FormReactiveComponent', () => {
  let component: FormReactiveComponent;
  let fixture: ComponentFixture<FormReactiveComponent>;
  let formService: FormsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormReactiveComponent],
      imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        NgxPatternModule
      ],
      providers: [
        { provide: FormsService, useClass: FormsTestingService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormReactiveComponent);
    component = fixture.componentInstance;
   
    formService = TestBed.inject(FormsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Form with properties defined', () => {
    expect(component.form.properties).toBeUndefined();
    fixture.detectChanges();
    spyOn(formService, 'getFormService').and.callThrough;
    expect(component.form.properties).toBeDefined();
  });

  it('Event submit is error with form invalid', () => {
    fixture.detectChanges();
    component.onSubmit();
    expect(component.showAlertError).toBeTruthy();
  });

  it('Set Form values with new Properties response', () => {
    fixture.detectChanges();
    let propertiesNew: properties | undefined = {
      email: { type: "string", format: "email", title: "Email", default: "", pattern: "", value: "example@gmail.com", error: "" },
      firstName: { type: "string", format: "", title: "First name", default: "John", pattern: "", value: "John", error: "" }
    }
    component.setForm(propertiesNew);
    expect(component.myForm.value).toEqual({ email: 'example@gmail.com', firstName: 'John' });
  });


  it('Create Form with Properties response', () => {
    expect(component.myForm.value).toEqual({});
    let propertiesNew: properties | undefined = {
      email: { type: "string", format: "email", title: "Email", default: "", pattern: "", value: "example@gmail.com", error: "" },
      firstName: { type: "string", format: "", title: "First name", default: "John", pattern: "", value: "John", error: "" }
    }
    component.createForm(propertiesNew);
    expect((component.myForm.controls)).not.toEqual({});
  });


  it('Form is invalid', () => {
    fixture.detectChanges();
    expect(component.myForm.invalid).toBeTruthy();
  });

  it('verificate required form', () => {
    fixture.detectChanges();
    expect(component.verificateRequired('email')).toBeTruthy();
  });

  it('verificate add format datetime ISO', () => {
    fixture.detectChanges();
    expect(component.addtoISOString("2020-11-01T10:00:00")).toBe("2020-11-01T10:00:00Z");
  });

  it('verificate delete format datetime ISO', () => {
    expect(component.deletedtoISOString("2020-11-01T10:00:00Z")).toBe("2020-11-01T10:00:00");
  });

  it('verificate transform format ReGex with pattern empty', () => {
    expect(component.getPattern("")).toEqual(new RegExp('^.+'));
  });
  it('verificate transform format ReGex with pattern OK', () => {
    expect(component.getPattern("^\\w{3,}$")).toEqual(new RegExp("^\\w{3,}$"));
  });


}); 
