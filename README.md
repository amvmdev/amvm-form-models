# amvm-form-models


## Installation
`npm install amvm-form-models --save`



## Documentation

### Example of form model
```javascript
export class Person {
    constructor(json) {
        json = json || {};
        this.name = {
            value: _.get(json, 'name', ''),
            title: 'Name',
            name: 'name',
            errors: []
        };

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

### FormModelValidator

`formModel` - class that contains "meta" objects. This class stores data.

`formModelValidators` - class that contains validators for specific meta objects.

`getMetaByPath(formModel, path)` - get meta object from `formModel` by path string

`getValidatorsByPath(formModelValidators, path)` - get array of validators for given path
