import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';

export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'Este campo é de preenchimento obrigatório.',
      'invalidEmailAddress': 'O formato do email inserido não é válido.',
      'invalidPassword': 'A password introduzida não é válida - deve conter no mínimo 6 carateres.',
      'mismatchPassword': `Os campos Password e Confirmar Password devem ter valores iguais.`,
      'minlength': `Tamanho mínimo: ${validatorValue.requiredLength}`,
      'number': `O campo é de preenchimento obrigatório.`,
      'minNumber': `Valor mínimo: ${validatorValue}`,
      'maxNumber': `Valor máximo: ${validatorValue}`,
      'rangeNumber': `Valor deve estar compreendido entre: ${validatorValue.min} e ${validatorValue.max}`,
      'invalidCreditCard': `Cartão de crédito inválido`,
      'invalidExpirationDate': `Data de validade inválida`
    };

    return config[validatorName];
  }

  /**
   * @param  {} control
   */
  static emailValidator(control: FormControl) {
    // RFC 2822 compliant regex
    if (control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return { 'invalidEmailAddress': true };
    }
  }

  /**
   * @param  {FormControl} control
   * Password is between 6 and 100 characters
   */
  static passwordValidator(control: FormControl) {
    // {6,100}           - Assert password is between 6 and 100 characters
    if (control.value.match(/^[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return { 'invalidPassword': true };
    }
  }

  static passwordMatchValidator(group: FormGroup) {
    let password = group.get('password');
    let confirmPassword = group.get('confirmPassword');

    if (!password.valid || !confirmPassword.valid) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { 'mismatchPassword': true };
  }

  /**
   * Number validator 
   * 
   * @static
   * @param {*} [params={}]
   * @returns {ValidatorFn}
   * 
   * @memberOf ValidationService
   */
  static number(params: any = {}): ValidatorFn {
    return (control: FormControl): { [key: string]: any } => {
      if (isNaN(control.value)) {
        return { "number": true };
      }
      else if (!isNaN(params.min) && !isNaN(params.max)) {
        return control.value < params.min || control.value > params.max ? { "rangeNumber": { "min": params.min, "max": params.max } } : null;
      }
      else if (!isNaN(params.min)) {
        return control.value < params.min ? { "minNumber": params.min } : null;
      }
      else if (!isNaN(params.max)) {
        return control.value > params.max ? { "maxNumber": params.max } : null;
      }
      else {
        return null;
      }
    }
  }

  /**
   * Available formats
   * - Mastercard: '^5[1-5][0-9]{14}$',
	 * - Visa: '^4[0-9]{12}(?:[0-9]{3})?$',
	 * - American Express: '^3[47][0-9]{13}$'
   * 
   * Examples
   * - Mastercard: 5555555555554444
   * - Visa: 4111111111111111
   * - American Express: 378282246310005
   * 
   * @static
   * @param {FormControl} control
   * @returns
   * 
   * @memberOf ValidationService
   */
  static creditCard(control: FormControl) {
    const mastercard = /^5[1-5][0-9]{14}$/;
    const visa = /^4[0-9]{12}(?:[0-9]{3})?$/;
    const americanExpress = /^3[47][0-9]{13}$/;

    // Remove the spaces of the credit card value
    let value = control.value.replace(/\s+/g, '');

    if (value.match(mastercard) || value.match(visa) || value.match(americanExpress)) {
      return null;
    } else {
      return { 'invalidCreditCard': true };
    }
  }

  /**
   * Examples
   * - 01/17
   * - 10/2017
   * - 10 / 2017
   * 
   * @static
   * @param {FormControl} control
   * @returns
   * 
   * @memberOf ValidationService
   */
  static expirationDate(control: FormControl) {
    const expiryRegex = `^(0[1-9]|1[0-2]) ?\/? ?([0-9]{4}|[0-9]{2})$`;

    if (control.value.match(expiryRegex)) {
      return null;
    } else {
      return { 'invalidExpirationDate': true };
    }
  }

  /**
   * @param  {FormGroup} form
   * Marks all controls as touched (to avoid no error message if the form in untouched)
   */
  static markControlsAsTouched(form: FormGroup) {
    for (let controlName in form.controls) {
      let control = form.controls[controlName];
      control.markAsTouched();
    }
  }
}