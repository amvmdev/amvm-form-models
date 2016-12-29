import validator from 'validator';
import _ from 'lodash';

export const isNotEmpty = (value) => {
    value = validator.trim(value);
    return !validator.equals(value, '');
};

export const minMaxLength = (min, max) => {
    return (value) => {
        value = validator.trim(value);

        if (value === '')
            return true;

        return validator.isLength(value, { min, max });
    }
};

export const matchTo = (field) => {
    return (value, formModel) => {
        if (value !== _.get(formModel, field).value) {
            return false;
        }
        return true;
    }
};

export const isEmail = (value) => {
    if (value === '')
        return true;

    value = validator.trim(value);
    return validator.isEmail(value);
};


export const isNumeric = (value) => {
    value = value.toString();
    value = validator.trim(value);
    if(!isNotEmpty(value))
        return true;
    return isNotEmpty(value) && validator.isNumeric(value);
};

export const isDecimal = (value) => {
    value = value.toString();
    value = validator.trim(value);
    if(!isNotEmpty(value))
        return true;
    return isNotEmpty(value) && validator.isDecimal(value);
};