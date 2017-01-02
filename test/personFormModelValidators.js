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