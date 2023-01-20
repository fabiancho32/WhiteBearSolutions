import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-control-errors',
  templateUrl: './control-errors.component.html',
  styleUrls: ['./control-errors.component.scss']
})
export class ControlErrorsComponent implements OnInit {

  @Input() ctrl?: FormControl | null;

  ERROR_MESSAGE = {
    required: () => `This field is required`
  };

  constructor() { }

  ngOnInit() { }

  shouldShowErrors(): boolean | null {
    if (this.ctrl) {
      return this.ctrl && this.ctrl.errors && this.ctrl.touched;
    } else {
      return null;
    }
  }

  listOfErrors(): string[] {
    if (this.ctrl?.errors) {
      return Object.keys(this.ctrl.errors).map(
        err => (this.ctrl?.getError(err))
      );
    } else {
      return [];
    }
  }

}
