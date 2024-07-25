import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Country } from '../../common/country';
import { State } from '../../common/state';
import { CheckoutService } from '../../services/checkout.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  checkoutFormGroup: FormGroup
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  totalQuantity = 0;
  totalPrice = 0;
  
  
  constructor(private formBuilder: FormBuilder,
    private checkoutService: CheckoutService
    , private cartService: CartService) { }
  
  reviewCartDetails() {
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    })
  }

  ngOnInit() {

    //calling cart review
    this.reviewCartDetails();


    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [sessionStorage.getItem('firstName'), [Validators.required, Validators.pattern('[A-Za-z]+')]],
        lastName: [sessionStorage.getItem('lastName'), [Validators.required, Validators.pattern('[A-Za-z]+')]],
        email: [sessionStorage.getItem('email'), [Validators.required, Validators.email]],
        mobile: [sessionStorage.getItem('mobile'), [Validators.required, Validators.pattern('[6-9][0-9]{9}')]],
      }),
      shippingAddress: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],

      }),
      billingAddress: this.formBuilder.group({
        street: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        zipCode: ['', [Validators.required, Validators.pattern('[0-9]{6}')]],

      }),
    });
    //populate countries
    this.checkoutService.getCountires().subscribe((data) => {
      this.countries = data;
      console.log(data);
    });
  }

  //getter  methods
  get firstName() {
    return this.checkoutFormGroup.get('customer.firstName');
  }

  get lastName() {
    return this.checkoutFormGroup.get('customer.lastName');
  }

  get email() {
    return this.checkoutFormGroup.get('customer.email');
  }

  get mobile() {
    return this.checkoutFormGroup.get('customer.mobile');
  }

  //shipping address getters method
  get shippingAddressStreet() {
    return this.checkoutFormGroup.get('shippingAddress.street');

  }

  get shippingAddressCity() {
    return this.checkoutFormGroup.get('shippingAddress.city');

  }

  get shippingAddressState() {
    return this.checkoutFormGroup.get('shippingAddress.state');

  }

  get shippingAddressCountry() {
    return this.checkoutFormGroup.get('shippingAddress.country');

  }

  get shippingAddressZipCode() {
    return this.checkoutFormGroup.get('shippingAddress.zipCode');

  }


  //billing address getters method
  get billingAddressStreet() {
    return this.checkoutFormGroup.get('billingAddress.street');

  }

  get billingAddressCity() {
    return this.checkoutFormGroup.get('billingAddress.city');

  }

  get billingAddressState() {
    return this.checkoutFormGroup.get('billingAddress.state');

  }

  get billingAddressCountry() {
    return this.checkoutFormGroup.get('billingAddress.country');

  }

  get billingAddressZipCode() {
    return this.checkoutFormGroup.get('billingAddress.zipCode');

  }


  copyShippingAddress(event: any) {
    if (event.target.checked) {
      //reading shippingAddress form data
      const shippingAddressData = this.checkoutFormGroup?.get('shippingAddress')?.value;

      //assign shipping address form to billing address form data
      this.checkoutFormGroup?.controls?.['billingAddress'].setValue(shippingAddressData);
      //bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormGroup.controls?.["billingAddress"].reset();
      this.billingAddressStates = [];
    }
  }

  onSubmit() {
    console.log(this.checkoutFormGroup?.get('customer')?.value);
    console.log(this.checkoutFormGroup?.get('shippingAddress')?.value);
    console.log(this.checkoutFormGroup?.get('billingAddress')?.value);

    if (this.checkoutFormGroup.invalid) {
      alert('Form is invalid');
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

  }
  getStates(FormGroupName: string) {
    const FormGroup = this.checkoutFormGroup.get(FormGroupName);
    const countryCode = FormGroup?.value.country.code;
    const countryName = FormGroup?.value.country.name;
    this.checkoutService.getStates(countryCode).subscribe((data) => {
      if (FormGroupName === 'shippingAddress') {
        this.shippingAddressStates = data;
      } else {
        this.billingAddressStates = data;
      }

      //select  first item by default
      FormGroup?.get('state')?.setValue(data[0]);
    });
  }
}