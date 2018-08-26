# react-form

## Create a form
[**Link to form example**](https://github.com/fun-coder/react-form/blob/master/example/UserContainer.tsx)

**Field Props**
-`defaultValues?: Record<string, any>`
<br> The form default value

**Form Api**
- `getFiled(fieldName: string): Field`
<br>Get the field by field name

- `Submit(): Promise<Record<string, any>>`
<br>Return a promise
<br>resolve form data when validating successfully
<br>reject a map of ValidationError when validating failed

## Create a field
[**Link to field example**](https://github.com/fun-coder/react-form/blob/master/example/fields/TextFields.tsx)

**Field Props**
- `name: string`
<br>The field name

- `defaultValue?: T`
<br>The field default value
 
- `validators?: Validator<T>[]`
<br> The field [validator](#validation) array 

**Field Api**

- `validate(): Promise<void>`
<br>Return a promise. 
<br>resolve void when validating successfully
<br>reject a ValidationError when validating failed
 
- `getValue(): T|undefined` 
<br>Return field value

- `getValidValue(): Promise<T|undefined>`
<br>Return a promise. 
<br>resolve the field value when validating successfully
<br>reject a ValidationError when validating failed

- `cleanError(): void`
<br>Clean the field error 

- `getError(): ValidationError<T> | undefined` 
<br>Return the field error

- `setValue(value: T): void`
<br>Set the field value

- `subscribe(changeSubscriber: ChangeSubscriber<T>, errorSubscriber: ErrorSubscriber<T>): void`
    - *changeSubscriber*`(change: {name: string, prev?: T,curr: T}) => void`
<br>changeSubscribe is a function triggered when the value changed 
    - *errorSubscriber* is a function triggered when the field error changed (the error is missed when clear error) 
<br>`(error?: {fieldName: string, value?: T, message: string}) => void`

- `unsubscribe(...subscriber: Array<ChangeSubscriber<T> | ErrorSubscriber<T>>): void`
<br>Not trigger the subscribers when there is a change


## Validation
**Validator Constructor**
```typescript
    interface MessageGenerator {
      (fieldName: string, fieldValue: any): string
    }

    interface Validator<T> {
       validate: (value: T, form: Form) => boolean | Promise<boolean>
       message: MessageGenerator | string,
    }
```