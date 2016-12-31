# amvm-form-models


## Installation
`npm install amvm-form-models --save`

## Running tests
`npm test`


## Documentation

### Example of form model
```javascript
export class PersonFormModel {
    constructor(json) {
        json = json || {};
        'name.first': {
            title: 'First name',
            name: 'name.first',
            value: 'John'
            // errors field is missing, but it is still meta
        },
        'name.last': {
            title: 'Last name',
            name: 'name.last',
            value: 'Brown',
            errors: []
        },
        'isAdult': {
            title: 'Is adult',
            name: 'isAdult',
            value: true // value is boolean
        },
        'age': {
            title: 'Age',
            name: 'age',
            value: 30 // value is number
        },        
        
        emails: [
            {
                key: 'key1',
                type: {
                    title: 'Email type',
                    name: 'emails[key1].type',
                    value: 'Work',
                    errors: []
                },
                email: {
                    title: 'Email',
                    name: 'emails[key1].email',
                    value: 'john@company.com',
                    errors: []
                }
            },
            {
                key: 'key2',
                type: {
                    title: 'Email type',
                    name: 'emails[key2].type',
                    value: 'Personal',
                    errors: []
                },
                email: {
                    title: 'Email',
                    name: 'emails[key2].email',
                    value: 'john@gmail.com',
                    errors: []
                }
            }
        ],
        
        labels: [
            {
                key: 'key1',
                title: 'Label',
                name: 'labels[key1]',
                value: 'red',
                errors: []

            },
            {
                key: 'key2',
                title: 'Label',
                name: 'labels[key2]',
                value: 'blue',
                errors: []
            }
        ]  
        
        _modelErrors: {
            errors: []
        }
    }
}
```

In this class, `name` property is meta object. Meta object has following properties:

Property | Description
--- | ---
value | This property will contain value for meta object
title | Title of meta object. Usually value of title is used inside `<label>` 
required | If set to true, `<label>` tag will display *
maxlength | This value will be set as `maxlength` attribute on `<input>` tag
name | Value of name property is used for name atribute of input tag
errors[] | Array of errors after running all validators against value property

`labels` property is array. Each array item contains meta object with addition member called `key`.

`emails` property is array. Each array item contains obejct with `key` property, and many meta objects. Thats why `name` property of each meta obejct has format of `emails[some_unique_key].%property_name%`

`_modelErrors` is special property that contains just errors of complex validation. Complex validation does not belong to specific meta. Complex validation validates whole form model. This property will be automatically created if form model validators  class contains property `_modelErrors` with validators.

Resulting JSON will have following shape:
```javascript
{
    name : {
        first: 'John'
        last: 'Bown'
    },
    isAdult: true,
    age: 30,    
    labels: [ 'label_1', 'label_2'],
    emails: [ 
        { type: 'Work', email: 'ohn@company.com' },
        { type: 'Personal', email: 'john@gmail.com' },
    ]
}
```

### Example of form model validators
```javascript
export class PersonFormModelValidators {
    constructor() {
        this['name.first'] = [
            {
                validator: (value, formModel) => value.length < 10,
                errorMessage: 'First name must be less than 10 characters'
            },
            {
                validator: (value, formModel) => value && value.length > 0,
                errorMessage: 'First name is required'
            }
        ],

        this['name.last'] = [
            {
                validator: (value, formModel) => value && value.length > 0,
                errorMessage: 'Last name is required'
            },
            {
                validator: (value, formModel) => value != '1234567890',
                errorMessage: 'Last name cannot be 1234567890'
            }           
        ]

        this['labels[]'] = [
            {
                validator: (value, formModel) => value.length < 5,
                errorMessage: 'Label must be less than 5 characters'
            }            
        ]

        this['emails[].type'] = [
            {
                validator: (value, formModel) => value == "Work" || value == "Personal",
                errorMessage: 'Type of email can only be Work or Personal'
            }            
        ],
        this['emails[].email'] = [
            {
                validator: (value, formModel) => value.indexOf('@temp.com') == -1,
                errorMessage: 'gmail.com is not allowed'
            }            
        ],
        
        this._modelErrors = [
            {
                validator: (formModel) => formModel.labels.length <= 2,
                errorMessage: 'Maximum 2 labels allowed'
            },
            {
                validator: (formModel) => formModel.emails.length <= 2,
                errorMessage: 'Maximum 1 email allowed'
            }
        ]
    }
}
```


### FormModelValidator

#### getMetaByPath(formModel, path)
Get meta object from `formModel` by path string.

#### getValidatorsByPath(formModelValidators, path)
Get array of validators for given path.

#### fieldNameIsArray(fieldName)
Returns true if field name points to array. Example of field name: `labels[some_unique_key]` **(!!! may be we should rename this method to pathIsArray(path)**

#### parseFieldNameToArray(fieldName)
Takes field name (or path) that points to array, and returns following object:
```javascript
{
    itemKey: 'unique_key_of_array_item',
    pathToArray: 'name_of_array_property_on_form_model',
    arrayItemIsMeta: true if arrray item contains key and value properties only,
    metaPropertyName: 'name of array item property that contains meta, if arrayItemIsMeta is false',
    nameOfValidatorField: 'property name on validator class that responsible of validation array item meta '
}
```

#### getArrayIndexByKey(formModelArray, key)
Returns index of array item that contains passed unique key

#### isFieldValid(formModel, formModelValidators, fieldName)
Function finds meta by path, and runs validators against meta's value. If validator returns false, we add errors message from validator to meta's errors array. Returns true if meta object is valid.

#### isModelValid(formModel, formModelValidators, stopOnFirstError)
Function takes all validators and validates corresponding meta object in form model. While validating, `errors` property of each meta is filled of validation error messages. If `stopOnFirstError` is set to true (default is false), then validation process stops after first meta object is invalid. Returns true if form model is valid.

#### replaceErrors(formModel, errors)
Function takes errors as argument, and replaces errors in form model with passed errors object. `errors` is an object in following format:
```javascript
{
    'path_to_meta': [
        'error message 1',
        'error message 2'        
    ],
    // ... more properties
}
```


#### objectIsMeta(obj) 
Returns true if object has `value`, `errors` and `title` property.

#### getOrCreateNestedObjects(json, fieldPath)
Function takes json object, and adds nested object by path. Function return deepest object created.

Example:
`getOrCreateNestedObjects({}, 'contactInfo.address.city ')` will create following object:
```javascript
{
    contactInfo: {
        address: {
        }
    }
}
```
**Warning: city will not be added as object**


#### getOrCreateNestedArray(json, fieldPath)
Function takes json object, and adds array to json. Function returns created array.

Example:
`getOrCreateNestedArray({}, 'contactInfo.labels')` will create following object:
```javascript
{
    contactInfo: {
        labels: []
    }
}
```

#### getJSON(formModel, formModelValidators)
Function converts form model into json object. Following rules are applied:

First, `_modelErrors` meta is deleted from form model. It is used to display complex validation errors on web page.

Next, form models properties that are arrays, are converted into array on json. Meta peoperties converted into simple key/value property for json.

#### getErrors(forModel)
Function accepts form model and return plain json object with just errors. Example of return value:
```javascript
{ 
    email: ['error1', 'error2'], 
    firstName: ['error3', 'error4'] 
}
```

#### hasExistingErrors(formModel)
Function returns true if form model has errors (validators will not be run agains form model field).
