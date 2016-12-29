# amvm-form-models


## Installation
`npm install amvm-form-models --save`



## Documentation

### Example of form model
```javascript
export class PersonFormModel {
    constructor(json) {
        json = json || {};
        this.name = {
            value: _.get(json, 'name', ''),
            title: 'Name',
            name: 'name',
            required: true,
            maxlength: 50,
            errors: []
        };
        
        this.labels: [
            {
                key: 'some_unique_key',
                value: {
                    value: 'label_1',
                    title: 'Label',
                    name: `labels[some_unique_key]`,
                    errors: []
                }
            },
            {
                key: 'another_unique_key',
                value: {
                    value: 'label_2',
                    title: 'Label',
                    name: `labels[another_unique_key]`,
                    errors: []
                }
            }
        ],

        this.emails: [
            {
                key: 'some_unique_key',
                type: {
                    value: 'Personal',
                    title: 'E-mail type',
                    name: `emails[some_unique_key].type`,
                    errors: []
                },        
                email: {
                    value: 'user@example.com',
                    title: 'E-mail',
                    name: `emails[some_unique_key].email`,
                    required: true,
                    maxLength: 25,
                    errors: []
                }
            },
            //... more object in this array, each with unique key
        ]  
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

`labels` property is array. Each array item contains object that has just 2 properties: `key` and `value`. `value` is meta.

`emails` property is array. Each array item contains obejct with `key` property, and many meta objects. Thats why `name` property of each meta obejct has format of `emails[some_unique_key].%property_name%`

Resulting JSON will have following shape:
```javascript
{
    name: 'Markus',
    labels: [ 'label_1', 'label_2'],
    emails: [ 
        { type: 'Personal', email: 'user@example.com' },
        { type: 'Work', email: 'userwork@example.com' },
    ]
}
```

### Example of form model validators
```javascript
export class PersonFormModelValidators {
    constructor() {
        this.name = [
            {
                validator: (value, formModel) => true | false,
                errorMessage: 'Error message'
            },
            {
                validator: (value, formModel) => true | false,
                errorMessage: 'Error message 2'
            }
        ],

        this['labels[]'] = [
            {
                validator: (value, formModel) => true | false,
                errorMessage: 'Error message'
            }            
        ],
        
        this['emails[].type'] = [
            {
                validator: (value, formModel) => true | false,
                errorMessage: 'Error message'
            }            
        ],
        this['emails[].email'] = [
            {
                validator: (value, formModel) => true | false,
                errorMessage: 'Error message'
            }            
        ] 
    }
}
```


### FormModelValidator

`formModel` - class that contains "meta" objects. This class stores data.

`formModelValidators` - class that contains validators for specific meta objects.

`getMetaByPath(formModel, path)` - get meta object from `formModel` by path string

`getValidatorsByPath(formModelValidators, path)` - get array of validators for given path
