export class PersonFormModelValidators {
    constructor() {
        this['name.first'] = [
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for name.first',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for name.first (duplicate)',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('warning') === -1,
                message: 'this is warning for name.first',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value.indexOf('info') === -1,
                message: (value) => `this is info for name.first`,
                type: 'info'
            }
        ],

        this['name.last'] = [
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for name.last',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('warning') === -1,
                message: 'this is warning for name.last',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value.indexOf('info') === -1,
                message: (value) => `this is info for name.last`,
                type: 'info'
            }     
        ],

        this['age'] = [
            {
                validator: (value, formModel) => value != 1,
                message: 'this is error for name.last',
                type: 'error'
            },
            {
                validator: (value, formModel) => value != 2,
                message: 'this is warning for name.last',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value != 3,
                message: (value) => `this is info for name.last`,
                type: 'info'
            }     
        ]


        this['labels[]'] = [
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for label',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('warning') === -1,
                message: 'this is warning for label',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value.indexOf('info') === -1,
                message: 'this is info for label',
                type: 'info'
            }     
        ]

        this['emails[].type'] = [
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for emails[].type',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('warning') === -1,
                message: 'this is warning for emails[].type',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value.indexOf('info') === -1,
                message: 'this is info for emails[].type',
                type: 'info'
            }             
        ],
        this['emails[].email'] = [
            {
                validator: (value, formModel) => value.indexOf('error') === -1,
                message: 'this is error for emails[].email',
                type: 'error'
            },
            {
                validator: (value, formModel) => value.indexOf('warning') === -1,
                message: 'this is warning for emails[].email',
                type: 'warning'
            },
            {
                validator: (value, formModel) => value.indexOf('info') === -1,
                message: 'this is info for emails[].email',
                type: 'info'
            }
        ],

        this['_model'] = [
            {
                validator: (formModel) => formModel['name.first'].value.indexOf('meta_err') === -1,
                message: 'this is error for _model',
                type: 'error'
            },
            {
                validator: (formModel) => formModel['name.first'].value.indexOf('meta_err') === -1,
                message: 'this is error for _model (duplicate)',
                type: 'error'
            },
            {
                validator: (formModel) => formModel['name.first'].value.indexOf('meta_warn') === -1,
                message: 'this is warning for _model',
                type: 'warning'
            },
            {
                validator: (formModel) => formModel['name.first'].value.indexOf('meta_inf') === -1,
                message: 'this is info for _model',
                type: 'info'
            }
        ]

        // uncomment to have custom json creator for labels array
        // this['labels[].getJSON'] = (arrayItem, formModel) => {
        //     return {
        //         key: arrayItem.key,
        //         value: arrayItem.value
        //     }
        // }

        // uncomment to have custom json creator for emails array
        // this['emails[].getJSON'] = (arrayItem, formModel) => {
        //     return {
        //         key: arrayItem.key,
        //         value: {
        //             type: arrayItem.type.value,
        //             email: arrayItem.email.value
        //         }
        //     }
        // }

        // uncomment to have custom value for json's name.first path
        // this['name.first.getJSON'] = (meta, formModel) => {
        //     return meta.value
        // }

    }
}