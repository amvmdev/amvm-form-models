import _ from 'lodash';
import { personFormModel } from './personFormModel';

// Creating form model with invalid metas
let invalidPersonFormModel = _.cloneDeep(personFormModel);

invalidPersonFormModel['name.last'].value = '';


// creating invalid email (type can be only Work or Personal, and email cannot contain temp.com)
invalidPersonFormModel.emails.push({
    key: 'key3',
    type: {
        title: 'Email type',
        name: 'emails[key3].type',
        value: 'Other',
        errors: []
    },
    email: {
        title: 'Email',
        name: 'emails[key3].email',
        value: 'john@temp.com',
        errors: []
    }
});

// creating invalid label (label value cannot exceed 5 characters)
invalidPersonFormModel.labels.push({
    key: 'key3',
    title: 'Label',
    name: 'labels[key3]',
    value: 'very_long_value',
    errors: []

});

export {
    invalidPersonFormModel
};