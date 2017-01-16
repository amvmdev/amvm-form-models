import _ from 'lodash';

let personFormModel = {

    'not.meta': {
    },

    'name.first': {
        title: 'First name',
        name: 'name.first',
        value: 'John',
        maxLength: 100
        // errors field is missing, but it is still meta
    },

    'name.last': {
        title: 'Last name',
        name: 'name.last',
        value: 'Brown'
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

}


export function createValidFormModel() {
    let formModel = _.cloneDeep(personFormModel);
    return formModel;
}