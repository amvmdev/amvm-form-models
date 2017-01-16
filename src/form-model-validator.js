import _ from 'lodash';


export default class FormModelValidator {

    // function returns index of array item that has specific key
    static getArrayIndexByKey(formModelArray, key) {
        formModelArray = formModelArray || [];
        let index = -1;
        for (let i = 0; i < formModelArray.length; i++) {
            if (formModelArray[i].key === key) {
                index = i;
                break;
            }
        }

        return index;
    }

    // function returns meta by path
    static getMetaByPath(formModel, path) {
        let meta = null;

        if (FormModelValidator.pathIsArray(path)) {
            // get info related to array of metas
            let arrInfo = FormModelValidator.parsePathToArray(path);
            let array = formModel[arrInfo.pathToArray]; // this array contains metas or objects with metas
            array.forEach((arrayItem) => {
                // skip looping if we already found meta by key
                if (meta != null)
                    return;
                // array item can be meta or object that has meta inside
                if (arrayItem.key === arrInfo.itemKey) {
                    meta = arrInfo.arrayItemIsMeta
                        ? arrayItem
                        : arrayItem[arrInfo.metaPropertyName];
                }
            });

            // if variable meta is not actual meta, set it to undefined;
            if (!FormModelValidator.objectIsMeta(meta))
                meta = undefined;

        } else {
            meta = _.get(formModel, path);
        }

        return meta;
    }

    // function returns array of validators by path
    static getValidatorsByPath(formModelValidators, path) {
        let validators = null;
        if (FormModelValidator.pathIsArray(path)) {
            // get info related to array of metas
            let arrInfo = FormModelValidator.parsePathToArray(path);
            validators = formModelValidators[arrInfo.nameOfValidatorField];
        } else {
            validators = _.get(formModelValidators, path);
        }

        return validators;
    }

    // returns true if path points to array
    static pathIsArray(path) {
        return path.indexOf('[') !== -1;
    }

    // returns object with array paths and keys
    static parsePathToArray(path) {
        let result = {
            itemKey: null,
            pathToArray: null,
            arrayItemIsMeta: false,
            metaPropertyName: null,
            nameOfValidatorField: null
        };

        let indexOfArrayOpen = path.indexOf('[');
        let indexOfArrayClose = path.indexOf(']');
        let arrayItemKey = path.substring(indexOfArrayOpen + 1, indexOfArrayClose);

        result.itemKey = arrayItemKey;
        result.pathToArray = path.substring(0, indexOfArrayOpen);
        result.nameOfValidatorField = path.replace(`[${result.itemKey}]`, '[]');
        result.arrayItemIsMeta = path.endsWith("]");
        if (result.arrayItemIsMeta === false)
            result.metaPropertyName = path.substring(path.indexOf("].") + 2);

        return result;
    }

    // validate meta object
    static isMetaValid(formModel, formModelValidators, path) {
        let valid = true;
        // get validator for path of the model
        let validators = FormModelValidator.getValidatorsByPath(formModelValidators, path);
        validators = validators || [];

        // complex validation (not for specific path)
        if (path === '_model') {

            if (!formModel['_model']) {
                formModel['_model'] = { errors: [], warnings: [], infos: [] };
            } else {
                formModel['_model'].errors = [];
                formModel['_model'].warnings = [];
                formModel['_model'].infos = [];
            }

            // run validator agains model value
            for (let validatorItem of validators) {
                let result;
                try {
                    result = validatorItem.validator(formModel); // Note: for complex validation, there is single argument - FormModel
                } catch (err) {
                    console.error(`\nError while running validator for '_model'`);
                    console.error(err);
                }

                if (result === false) {
                    let message = null;
                    if (typeof (validatorItem.message) === 'string') {
                        message = validatorItem.message;
                    } else if (typeof (validatorItem.message) === 'function') {
                        message = validatorItem.message(meta.value, formModel);
                    }
                    else {
                        console.error('Validator\'s message property is not string or function.');
                    }

                    // add message to corresponding array
                    if (message != null) {
                        if (validatorItem.type === 'error') {
                            formModel['_model'].errors.push(message);
                            valid = false;
                        }
                        else if (validatorItem.type === 'info')
                            formModel['_model'].infos.push(message);
                        else if (validatorItem.type === 'warning')
                            formModel['_model'].warnings.push(message);
                        else {
                            valid = false;
                            formModel['_model'].errors.push(message); // if type is not set, treat is as error
                            console.warn(`Validator for '_model' is missing type property.`);
                        }
                    }
                }

                // if validator returned something other than boolean, log it to console
                if (typeof (result) !== 'boolean') {
                    console.error(`Validator returned result of type ${typeof (result)} for '_model'`);
                }
            }

        } else {
            let meta = FormModelValidator.getMetaByPath(formModel, path);
            // get form model value for path            
            if (!meta) {
                console.error(`FormModelValidator.isMetaValid: cannot find path of '${path}' in form model. 
                Check form model and form model validators for matching keys`);
                return true; // just mark meta as valid
            }

            // clear previous errors
            meta.errors = [];
            meta.warnings = [];
            meta.infos = [];

            // run validator agains model value
            for (let validatorItem of validators) {

                // For errors array, we allow only 1 error to be present
                if (validatorItem.type === 'error' || typeof (validatorItem.type) === 'undefined') {
                    if (meta.errors.length != 0)
                        continue;
                }


                // execute validator and get result (should be boolean)
                let result;
                try {
                    result = validatorItem.validator(meta.value, formModel); // Note: for each validator function, we pass second parameter that is FormModel                
                }
                catch (err) {
                    console.error(`\nError while running validator for meta '${meta.name}'`);
                    console.error(err);
                }

                if (result === false) {

                    let message = null;
                    if (typeof (validatorItem.message) === 'string') {
                        message = validatorItem.message;
                    } else if (typeof (validatorItem.message) === 'function') {
                        message = validatorItem.message(meta.value, formModel);
                    }
                    else {
                        console.error('Validator\'s message property is not string or function.');
                    }


                    // WARNING: meta is invalid if type of failed validator is type of 'error'
                    // add message to corresponding array
                    if (message != null) {
                        if (validatorItem.type === 'error') {
                            meta.errors.push(message);
                            valid = false;
                        }
                        else if (validatorItem.type === 'info')
                            meta.infos.push(message);
                        else if (validatorItem.type === 'warning')
                            meta.warnings.push(message);
                        else {
                            valid = false;
                            meta.errors.push(message); // if type is not set, treat is as error
                            console.warn(`Validator for ${meta.name} is missing type property.`);
                        }
                    }
                }

                // if validator returned something other than boolean, log it to console
                if (typeof (result) !== 'boolean') {
                    console.error(`Validator returned result of type ${typeof (result)} for meta '${meta.name}'`);
                }
            }
        }
        return valid;
    }

    // function loop all paths and run validators for each path. Return type is boolean
    static isModelValid(formModel, formModelValidators, stopOnFirstError) {
        stopOnFirstError = stopOnFirstError || false; // if provided TRUE, then validation stops on first error
        let valid = true;

        // get paths of all paths that needed to be validated
        let validatorPaths = [];
        _.forOwn(formModelValidators, (fieldValue, fieldName, obj) => {
            if (typeof fieldValue !== 'function') {
                validatorPaths.push(fieldName);
            }
        });

        // now loop every path and validate value at path
        for (let pathIndex = 0; pathIndex < validatorPaths.length; pathIndex++) {
            if (valid === false && stopOnFirstError === true)
                break;


            let path = validatorPaths[pathIndex];

            if (FormModelValidator.pathIsArray(path)) {
                // path points to array. It means we need to loop array and validate each item of array
                let arrayOfValidators = formModelValidators[path];
                let arrInfo = FormModelValidator.parsePathToArray(path);

                // get array from form model. Each array item is meta or object with metas
                let formModelArray = formModel[arrInfo.pathToArray];
                // now loop items inside array and run validator against each meta

                formModelArray.forEach((arrayItem) => {
                    let meta = arrInfo.arrayItemIsMeta
                        ? arrayItem
                        : arrayItem[arrInfo.metaPropertyName];

                    let result = FormModelValidator.isMetaValid(formModel, formModelValidators, meta.name);
                    if (!result) {
                        valid = false;
                    }
                });

            } else {
                let result = FormModelValidator.isMetaValid(formModel, formModelValidators, path);
                if (!result) {
                    valid = false;
                    if (stopOnFirstError === true)
                        break;
                }
            }
        }

        return valid;
    }

    // function checks is passed object has shape of metadata
    static objectIsMeta(obj) {
        if (obj) {
            return obj.hasOwnProperty('value') && !_.isObject(obj.value) && !_.isArray(obj.value);
        }
        return false;
    }

    // path can contains "." Function split path by dot and creates nested objects (after last dot is property name)
    // example: contactInfo.address.city will result into.    
    // { contactInfo: { 
    //     address: { }
    // }
    // Warning: "city" will not be added to "address" object
    static getOrCreateNestedObjects(json, path) {
        var parts = path.split('.');
        let nestedObject = json;
        for (let partIndex = 0; partIndex < parts.length - 1; partIndex++) {
            let part = parts[partIndex];
            if (nestedObject.hasOwnProperty(part) === false)
                nestedObject[part] = {};
            nestedObject = nestedObject[part];
        }
        return nestedObject;
    }

    // path can contains "." Function split path by dot and creates nested array
    // example: contactInfo.labels will result into.
    // { contactInfo: { 
    //     labels: []
    // }
    static getOrCreateNestedArray(json, path) {
        var parts = path.split('.');
        let nestedObject = json;
        // loop path and build or get deepest object        
        for (let partIndex = 0; partIndex < parts.length; partIndex++) {
            let part = parts[partIndex];
            // if it is the last part in path, then create empty array
            if (partIndex === parts.length - 1) {
                if (typeof (nestedObject[part]) === 'undefined')
                    nestedObject[part] = [];
            } else {
                if (nestedObject.hasOwnProperty(part) === false)
                    nestedObject[part] = {};
            }
            nestedObject = nestedObject[part];
        }
        return nestedObject;
    }

    // function accepts form model and return plain json object (json that we send to API)
    static getJSON(formModel, formModelValidators) {

        // Make a copy of formModel
        let formModelCopy = _.cloneDeep(formModel);

        // we always need to delete formModel['_model'] property. It is used only to display errors on web page
        delete formModelCopy['_model'];

        let result = {};
        _.forOwn(formModelCopy, (metaOrArray, path) => {

            if (_.isArray(metaOrArray)) {
                //let arrayForJson = FormModelValidator.getOrCreateNestedArray(result, path);
                _.set(result, path, []);
                let arrayForJson = _.get(result, path);

                metaOrArray.forEach((arrayItem) => {
                    // if formModelValidators contains function that creates json, use it
                    if (formModelValidators && typeof formModelValidators[`${path}[].getJSON`] === 'function') {
                        let customJson = formModelValidators[`${path}[].getJSON`](arrayItem, formModelCopy);
                        if (typeof(customJson) !== 'undefined' && customJson !== null) {
                            arrayForJson.push(customJson);
                        }
                    } else {
                        // if each array item is meta, then add value of that meta to array
                        if (arrayItem.key && FormModelValidator.objectIsMeta(arrayItem)) {
                            arrayForJson.push({ key: arrayItem.key, value: arrayItem.value });
                        }
                        else {
                            let objectWithManyValues = {
                                key: arrayItem.key,
                                value: {}
                            };

                            // array item is not meta, now loop properties of object to find all metas
                            _.forOwn(arrayItem, (arrayItemPathValue, arrayItemPath) => {
                                if (FormModelValidator.objectIsMeta(arrayItemPathValue)) {
                                    objectWithManyValues.value[arrayItemPath] = arrayItemPathValue.value;
                                }
                            });

                            arrayForJson.push(objectWithManyValues);
                        }
                    }
                });
            }
            else if (FormModelValidator.objectIsMeta(metaOrArray)) {
                if (formModelValidators && typeof formModelValidators[`${path}.getJSON`] === 'function') {
                    let customValue = formModelValidators[`${path}.getJSON`](metaOrArray, formModelCopy);
                    if (typeof(customValue) !== 'undefined' && customValue !== null) {
                        _.set(result, path, customValue);
                    }
                } else {
                    _.set(result, path, metaOrArray.value);
                }
            }
        });
        return result;
    }

    // function accepts form model and return plain json object with just errors/warnings/infos    
    static getErrors(formModel) {
        let errors = {};
        _.forOwn(formModel, (metaOrArray, path) => {
            if (_.isArray(metaOrArray)) {
                // this is array, loop array to get errors from array items
                metaOrArray.forEach((arrayItem) => {
                    if (arrayItem.key && FormModelValidator.objectIsMeta(arrayItem)) {
                        // array item is object that contains single meta
                        let errorObjKeyName = `${path}[${arrayItem.key}]`; // key name of error object                        
                        if (arrayItem.errors && arrayItem.errors.length > 0) {
                            if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                            errors[errorObjKeyName].errors = arrayItem.errors;
                        }
                        if (arrayItem.warnings && arrayItem.warnings.length > 0) {
                            if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                            errors[errorObjKeyName].warnings = arrayItem.warnings;
                        }
                        if (arrayItem.infos && arrayItem.infos.length > 0) {
                            if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                            errors[errorObjKeyName].infos = arrayItem.infos;
                        }
                    } else {
                        // array item is object that contains multiple meta, loop object proeprties and get errors from each meta
                        _.forOwn(arrayItem, (arrayItemObjectPropValue, arrayItemObjectPropName) => {
                            const errorObjKeyName = `${path}[${arrayItem.key}].${arrayItemObjectPropName}`;
                            if (FormModelValidator.objectIsMeta(arrayItemObjectPropValue)) {
                                if (arrayItemObjectPropValue.errors && arrayItemObjectPropValue.errors.length > 0) {
                                    if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                                    errors[errorObjKeyName].errors = arrayItemObjectPropValue.errors;
                                }
                                if (arrayItemObjectPropValue.warnings && arrayItemObjectPropValue.warnings.length > 0) {
                                    if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                                    errors[errorObjKeyName].warnings = arrayItemObjectPropValue.warnings;
                                }
                                if (arrayItemObjectPropValue.infos && arrayItemObjectPropValue.infos.length > 0) {
                                    if (!errors[errorObjKeyName]) { errors[errorObjKeyName] = {}; }
                                    errors[errorObjKeyName].infos = arrayItemObjectPropValue.infos;
                                }
                            }
                        });
                    }
                });
            } else if (FormModelValidator.objectIsMeta(metaOrArray) || path === "_model") {

                if (metaOrArray.errors && metaOrArray.errors.length > 0) {
                    if (!errors[path]) { errors[path] = {}; }
                    errors[path].errors = metaOrArray.errors;
                }
                if (metaOrArray.warnings && metaOrArray.warnings.length > 0) {
                    if (!errors[path]) { errors[path] = {}; }
                    errors[path].warnings = metaOrArray.warnings;
                }
                if (metaOrArray.infos && metaOrArray.infos.length > 0) {
                    if (!errors[path]) { errors[path] = {}; }
                    errors[path].infos = metaOrArray.infos;
                }
            }
        });


        return errors;
    }

    // function puts errors in form-model (when we get model validation on server). 
    static replaceErrors(formModel, errors) {
        _.forOwn(errors, (obj, path) => {
            let meta = null;
            if (path === '_model') {
                meta = FormModelValidator.getMetaByPath(formModel, path);
                if (!meta) {
                    meta = {};
                    formModel['_model'] = meta;
                }
            } else {
                meta = FormModelValidator.getMetaByPath(formModel, path);
            }

            if (meta) {
                meta.errors = [];
                meta.errors = obj.errors;
                meta.warnings = obj.warnings;
                meta.infos = obj.infos;
            }
        });

        return formModel;
    }

    // function returns true if form model has errors (validators will not be run agains form model paths)
    static hasExistingErrors(formModel) {
        let hasErrors = false;
        _.forOwn(formModel, (metaOrArray, path) => {
            if (hasErrors === true) {
                return hasErrors;
            }
            if (_.isArray(metaOrArray)) {
                // this is array, loop array to get errors from array items
                metaOrArray.forEach((arrayItem) => {
                    if (FormModelValidator.objectIsMeta(arrayItem)) {
                        // array item is meta, get errors form that meta
                        if (arrayItem.errors && arrayItem.errors.length > 0) {
                            hasErrors = true;
                        }
                    } else {
                        // array item is object that contains meta, loop object proeprties and get errors from each meta
                        _.forOwn(arrayItem, (arrayItemObjectPropValue, arrayItemObjectPropName) => {
                            if (FormModelValidator.objectIsMeta(arrayItemObjectPropValue)) {
                                // array item is meta, get errors form that meta
                                if (arrayItemObjectPropValue.errors && arrayItemObjectPropValue.errors.length > 0) {
                                    hasErrors = true;
                                }
                            }
                        });
                    }
                });
            } else if (FormModelValidator.objectIsMeta(metaOrArray) || path === "_model") {
                if (metaOrArray.errors && metaOrArray.errors.length > 0) {
                    hasErrors = true;
                }
            }
        });
        return hasErrors;
    }

}