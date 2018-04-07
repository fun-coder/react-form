export class FormException {
  constructor(errors) {
    this.errors = errors;
  }

  get content() {
    return this.errors;
  }
}