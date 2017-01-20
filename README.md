# amvm-form-models


## Installation
`npm install amvm-form-models --save`

## Running tests
`npm test`


## Documentation

### Example of form model
```javascript
export class PersonFormModel {
    constructor() {        
        'name.first': {
            title: 'First name',
            name: 'name.first',
            value: 'John',
            maxLength: 100,
            errors: [],
            warnings: [],
            infos: []
        },
        'name.last': {
            title: 'Last name',
            name: 'name.last',
            value: 'Brown',
            // errors, warnings and infos field is missing, and they will be created automatically when validating
        },
        'gender': {
            value: 'male',
            title: 'Gender',
            name: 'gender',
            dropdownValues: [
                { value: 'set-null', text: 'Select gender'},
                { value: 'male', text: 'Male'},
                { value: 'female', text: 'Female'}
            ]
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
                    value: 'Work'
                },
                email: {
                    title: 'Email',
                    name: 'emails[key1].email',
                    value: 'john@company.com'
                }
            },
            {
                key: 'key2',
                type: {
                    title: 'Email type',
                    name: 'emails[key2].type',
                    value: 'Personal'
                },
                email: {
                    title: 'Email',
                    name: 'emails[key2].email',
                    value: 'john@gmail.com'
                }
            }
        ],
        
        labels: [
            {
                key: 'key1',
                title: 'Label',
                name: 'labels[key1]',
                value: 'red'

            },
            {
                key: 'key2',
                title: 'Label',
                name: 'labels[key2]',
                value: 'blue'
            }
        ]  
        
        // errors, warnings and infos arrays will be automatically created if there are validators for '_model' path
        _model: { }
    }
}
```

In this class, `name.first` property is meta object. Meta object has following properties:

Property | Description
--- | ---
value | This property will contain value for meta object
title | Title of meta object. Usually value of title is used inside `<label>` 
required | If set to true, `<label>` tag will display 
maxlength | This value will be set as `maxlength` attribute on `<input>` tag
name | Value of name property is used for name atribute of input tag
errors[] | Array of errors after running all validators against value property
warnings[] | Array of warnings after running all validators against value property
infos[] | Array of info messages after running all validators against value property
dropdownValues | Array of object. Each object should have `value` and `text` property. This array can be used to build dropdown with these values.

`labels` property is array. Each array item contains meta object with additional member called `key`.

`emails` property is array. Each array item contains obejct with `key` property, and many meta objects. Thats why `name` property of each meta obejct has format of `emails[some_unique_key].%property_name%`

`_model` is special property that contains errors, warnings and infos arrays. These arrays will be created by complex validators in '_model' field. Complex validation does not belong to specific meta. Complex validation validates whole form model.

Resulting JSON will have following shape:
```javascript
{
    name : {
        first: 'John'
        last: 'Bown'
    },
    isAdult: true,
    age: 30,    
    labels: [
        { 
            key: 'key1', 
            value: 'red'
        },
        { 
            key: 'key2', 
            value: 'blue'
        }
    ],
    emails: [ 
        { 
            key: 'key1', 
            value: { 
                type: 'Work', 
                email: 'john@company.com' 
            }
        },
        {
            key: 'key2',
            value: { 
                type: 'Personal', 
                email: 'john@gmail.com' 
            }
        }        
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
                message: 'First name must be less than 10 characters',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.length > 0,
                message: 'First name is required',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.length !== 1,
                message: (value) => `${value} is too short for a name`,
                type: 'warning'
            },            
            {
                validator: (value, formModel) => value !== 'test',
                message: 'Is is really test?',
                type: 'info'
            } 
        ],

        this['name.last'] = [
            {
                validator: (value, formModel) => value.length < 10,
                message: 'Last name must be less than 10 characters',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.length > 0,
                message: 'Last name is required',
                type: 'error'
            },         
        ]

        this['labels[]'] = [
            {
                validator: (value, formModel) => value.length < 5,
                message: 'Label must be less than 5 characters',
                type: 'error'
            }            
        ]

        this['emails[].type'] = [
            {
                validator: (value, formModel) => value == "Work" || value == "Personal",
                message: 'Type of email can only be Work or Personal',
                type: 'error'
            }            
        ],
        this['emails[].email'] = [
            {
                validator: (value, formModel) => value.indexOf('@temp.com') == -1,
                message: 'temp.com is not allowed',
                type: 'error'
            }            
        ],
        
        this._model = [
            {
                validator: (formModel) => formModel['name.first'].value !== formModel['name.first'].value,
                message: 'First name is the same as last name',
                type: 'error'
            }
        ],        

        // function that used by `getJSON` function to produce array item for json's labels property
        this['labels[].getJSON'] = (arrayItem, formModel) => {
            return {
                key: arrayItem.key,
                value: arrayItem.value
            }
        }

        // function that used by `getJSON` function to produce array item for json's emails property
        this['emails[].getJSON'] = (arrayItem, formModel) => {
            return {
                key: arrayItem.key,
                value: {
                    type: arrayItem.type.value,
                    email: arrayItem.email.value
                }
            }
        }

        // function that used by `getJSON` function to produce value for json's name.first property
        this['name.first.getJSON'] = (meta, formModel) => {
            return meta.value
        }
    }
}
```


### FormModelValidator

#### getMetaByPath(formModel, path)
Get meta object from `formModel` by path string.

#### getValidatorsByPath(formModelValidators, path)
Get array of validators for given path.

#### pathIsArray(path)
Returns true if path points to array. Example of path: `labels[some_unique_key]` 

#### parsePathToArray(path)
Takes path that points to array, and returns object with information about array and array meta. 

Example of calling `parsePathToArray('labels[key2]')`:
```javascript
{
    itemKey: 'key2', //unique_key_of_array_item'
    pathToArray: 'labels', //name_of_array_property_on_form_model
    arrayItemIsMeta: true,  //true if arrray item is meta object and contains key property
    metaPropertyName: null, //name of array item property that contains meta, if arrayItemIsMeta is false
    nameOfValidatorField: 'labels[]' // property name on validator class that responsible of validation array item meta
}
```

Example of calling `parsePathToArray('emails[key2].email')`:
```javascript
{
    itemKey: 'key2', //unique_key_of_array_item'
    pathToArray: 'emails', //name_of_array_property_on_form_model
    arrayItemIsMeta: false,  //true if arrray item is meta object and contains key property
    metaPropertyName: 'email', //name of array item property that contains meta, if arrayItemIsMeta is false
    nameOfValidatorField: 'emails[].email' // property name on validator class that responsible of validation array item meta
}
```

#### getArrayIndexByKey(formModelArray, key)
Returns index of array item that contains passed unique key

#### isMetaValid(formModel, formModelValidators, path)
Function finds meta by path, and runs validators against meta's value. 
If validator returns false, we add message to `errors` or `warnings` or `infos` array depends on the type. 
Returns true if meta object is valid.

#### isModelValid(formModel, formModelValidators, stopOnFirstError)
Function takes all validators and validates corresponding meta object in form model. 
While validating, `errors`, `warnings` and `infos` properties of each meta is filled of validation messages. 
If `stopOnFirstError` is set to true (default is false), then validation process stops after first meta object is invalid. 
Returns true if form model is valid.

#### getErrors(formModel)
Function accepts form model and return plain json object with errors, warnings and infos. Example of return value:
```javascript
{
    'name.first': {
        errors: ['msg', 'msg'],
        warnings: ['msg', 'msg'],
        infos: ['msg', 'msg'],

    },
    'emails[key2].type': {
        errors: [ 'msg' ],
        warnings: [ 'msg' ],
        infos: [ 'msg' ]
    },
    'emails[key2].email': {
        errors: [ 'msg' ],
        warnings: [ 'msg' ],
        infos: [ 'msg' ]
    },
    'labels[key2]': [ 'msg'],
    '_model': {
        errors: ['msg', 'msg'],
        warnings: ['msg', 'msg'],
        infos: ['msg', 'msg'],

    },
}
```

#### replaceErrors(formModel, errors)
Function takes errors as argument, and replaces errors/warnings/infos in form model with passed errors object. `errors` is an object in following format:
```javascript
{
    'name.first': {
        errors: ['msg', 'msg'],
        warnings: ['msg', 'msg'],
        infos: ['msg', 'msg'],

    },
    'emails[key2].type': {
        errors: [ 'msg' ],
        warnings: [ 'msg' ],
        infos: [ 'msg' ]
    },
    'emails[key2].email': {
        errors: [ 'msg' ],
        warnings: [ 'msg' ],
        infos: [ 'msg' ]
    },
    'labels[key2]': [ 'msg'],
    '_model': {
        errors: ['msg', 'msg'],
        warnings: ['msg', 'msg'],
        infos: ['msg', 'msg'],

    },
}
```


#### objectIsMeta(obj) 
Returns true if object has `value` of type `string`, `number` or `boolean`.

#### getOrCreateNestedObjects(json, path)
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


#### getOrCreateNestedArray(json, path)
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

First, `_model` object is deleted from form model. It is used to display complex validation errors on web page.

Next, form models properties that are arrays, are converted into array on json. Meta properties converted into simple key/value property for json.
If form model validator has function that creates custom json, it will be used to create value for json part.



#### hasExistingErrors(formModel)
Function returns true if form model has errors (validators will not be run agains form model field).




## Server helpers

### Creating form model

#### createFullModel

```javascript
createFullModel(json, fnFormModel, fnFormModelValidators, fnFullModel, httpRequest);
```

This function accepts json from client and creates full model that will be stored in database.

Property | Description
--- | ---
json | JSON that came from client.
fnFormModel | Form model constructor function. This constructor function accepts json and creates form model with values from that json. Extra properties in json are ignored when building form model. Same constructor function has to be used on the client to create json.
fnFormModelValidators | Constructor function that contains validator for form model properties.
fnFullModel | Full model constructor function. This function takes json and creates json object that represents full model that will be stored in database.


Result of this function call:
```javascript
 {
    isValid: true|false,
    json: {...},
    errors: {...}
}
```

`isValid` is set to true if after creating form model with json, form model can be successfully validated using `fnFormModelValidators`.

`json` is JSON object that will go into database. This is complete model of business entity. `meta` and `_id` properties will be deleted from returned json.

`errors` is errors object created by calling `FormModelValidator.getErrors(formModel)` is `isValid` is false.


#### createFullModelAnon

```javascript
createFullModel(json, fnFormModel, fnFormModelValidators, fnFullModel, httpRequest);
```

Function does the same as `createFullModel` except it does not set ownerId in meta.


#### createFormModel

```javascript
createFormModel(json, fnFormModel, fnFormModelValidators);
```

This function accepts json from client and creates form model and returnes json from that form model.

Property | Description
--- | ---
json | JSON that came from client.
fnFormModel | Form model constructor function. This constructor function accepts json and creates form model with values from that json. Extra properties in json are ignored when building form model. Same constructor function has to be used on the client to create json.
fnFormModelValidators | Constructor function that contains validator for form model properties.

Result of this function call:
```javascript
 {
    isValid: true|false,
    json: {...},
    errors: {...}
}
```

`isValid` is set to true if after creating form model with json, form model can be successfully validated using `fnFormModelValidators`.

`json` is JSON object created from form model. 

`errors` is errors object created by calling `FormModelValidator.getErrors(formModel)` is `isValid` is false.
