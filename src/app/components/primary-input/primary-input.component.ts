import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

type InputTypes = "text" | "email" | "password"
@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers:[
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ],
  templateUrl: './primary-input.component.html',
  styleUrl: './primary-input.component.scss'
})
export class PrimaryInputComponent implements ControlValueAccessor {
  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  @Input() type: InputTypes = "text";
  @Input() placeholder: string = "";
  @Input() label : string = "oi";
  @Input() inputName : string = "";

  value: string = ''
  onChange: any = () => {}
  onTouched: any = () => {}

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
  }

  registerOnChange(fn: any): void {
      this.onChange = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    
  }
}
