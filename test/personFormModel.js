export const personFormModel = {
    
    'not.meta': {        
    },

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
                value: 'john@home.com',
                errors: []
            }
        }
    ],

    labels: [
        {
            key: 'key1',
            value: {
                title: 'Label',
                name: 'labels[key1]',
                value: 'red',
                errors: []
            }
        },
        {
            key: 'key2',
            value: {
                title: 'Label',
                name: 'labels[key2]',
                value: 'blue',
                errors: []
            }
        }
    ]
}