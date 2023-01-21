import { form } from 'src/app/models/form-model';
import { Observable, of } from 'rxjs';

export class FormsTestingService {
    getFormService(): Observable<form> {
      return of(
        {
          title: "Welcome to our website!",
          description: "Please, fill this form in order to register in our website.",
          required: ["email", "telephone"],
          properties:
          {
            email: { type: "email", format: "email", title: "email", default: "email", pattern: "email", value: "email", error: "email" },
            firstName: { type: "email", format: "email", title: "email", default: "email", pattern: "email", value: "email", error: "email" }
          },
        })
    }
  }