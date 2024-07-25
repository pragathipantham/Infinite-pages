import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  customerFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.customerFormGroup = this.fb.group({
      customer: this.fb.group({
        firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
      })
    });
  }

  get firstName() {
    return this.customerFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.customerFormGroup.get('customer.lastName');
  }

  get email() {
    return this.customerFormGroup.get('customer.email');
  }

  get password() {
    return this.customerFormGroup.get('customer.password');
  }

  get mobile() {
    return this.customerFormGroup.get('customer.mobile');
  }

  onSubmit() {
    if (this.customerFormGroup.valid) {
      console.log('Form Submitted', this.customerFormGroup.value);
    }
  }

  redirectToSignin() {
    this.router.navigate(['/login']);
  }
}
