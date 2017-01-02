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
            if(!FormModelValidator.objectIsMeta(meta)) 
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
        if (path === '_modelErrors') {
            if (!formModel['_modelErrors'])
                formModel['_modelErrors'] = { errors: [] };
            else
                formModel['_modelErrors'].errors = [];

            // run validator agains model value
            for (let validatorItem of validators) {
                let result = validatorItem.validator(formModel); // Note: for complex validation, there is single argument - FormModel

                if (result !== true) {
                    valid = false;
                    formModel['_modelErrors'].errors.push(validatorItem.errorMessage);
                    break;
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

            // run validator agains model value
            for (let validatorItem of validators) {
                let result = validatorItem.validator(meta.value, formModel); // Note: for each validator function, we pass second parameter that is FormModel
                if (result !== true) {
                    valid = false;
                    meta.errors.push(validatorItem.errorMessage);
                    break;
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
                    meta.errors = [];
                    // run validator agains meta value
                    for (let validatorItem of arrayOfValidators) {
                        let result = validatorItem.validator(meta.value, formModel); // Note: for each validator function, we pass second parameter that is FormModel
                        if (result !== true) {
                            valid = false;
                            meta.errors.push(validatorItem.errorMessage);
                            if (stopOnFirstError === true)
                                break;
                        }
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

    // function puts errors in form-model (when we get model validation on server). 
    static replaceErrors(formModel, errors) {
        _.forOwn(errors, (errorArray, path) => {
            let meta = FormModelValidator.getMetaByPath(formModel, path);
            if (meta) {
                meta.errors = [];
                meta.errors = errorArray;
            }
        });

        return formModel;
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
                if(typeof(nestedObject[part]) === 'undefined')
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

        // we always need to delete formModel['_modelErrors'] property. It is used only to display errors on web page
        delete formModelCopy['_modelErrors'];

        let result = {};
        _.forOwn(formModelCopy, (formModelPathValue, formModelPath) => {

            if (_.isArray(formModelPathValue)) {
                let arrayForJson = FormModelValidator.getOrCreateNestedArray(result, formModelPath);

                formModelPathValue.forEach((arrayItem) => {
                    // if formModelValidators contains function that creates json, use it
                    if (formModelValidators && typeof formModelValidators[`${formModelPath}[].getJSON`] === 'function') {
                        let customJson = formModelValidators[`${formModelPath}[].getJSON`](arrayItem, formModelCopy);
                        if (customJson != null) {
                            arrayForJson.push(customJson);
                        }
                    } else {
                        // if each array item is meta, then add value of that meta to array
                        if (arrayItem.key &&  FormModelValidator.objectIsMeta(arrayItem)) {
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
            else if (FormModelValidator.objectIsMeta(formModelPathValue)) {
                // split path and create nested objects if necessary
                if (formModelPath.indexOf('.') !== -1) {
                    var parts = formModelPath.split('.');
                    let nestedObject = FormModelValidator.getOrCreateNestedObjects(result, formModelPath);
                    nestedObject[parts[parts.length - 1]] = formModelPathValue.value;

                } else {
                    result[formModelPath] = formModelPathValue.value;
                }
            }
        });
        return result;
    }

    // function accepts form model and return plain json object with just errors
    // Example: { email: ['error1', 'error2'], firstName: ['error3', 'error4'] }
    static getErrors(formModel) {
        let errors = {};
        _.forOwn(formModel, (formModelFieldValue, formModelFieldName) => {
            if (_.isArray(formModelFieldValue)) {
                // this is array, loop array to get errors from array items
                formModelFieldValue.forEach((arrayItem) => {
                    if (arrayItem.key && FormModelValidator.objectIsMeta(arrayItem)) { // FormModelValidator.objectIsMeta(arrayItem)
                        // array item is meta, get errors form that meta
                        if (arrayItem.errors && arrayItem.errors.length > 0) {
                            errors[`${formModelFieldName}[${arrayItem.key}]`] = arrayItem.errors;
                        }
                    } else {
                        // array item is object that contains meta, loop object proeprties and get errors from each meta
                        _.forOwn(arrayItem, (arrayItemObjectPropValue, arrayItemObjectPropName) => {
                            if (FormModelValidator.objectIsMeta(arrayItemObjectPropValue)) {
                                // array item is meta, get errors form that meta
                                if (arrayItemObjectPropValue.errors && arrayItemObjectPropValue.errors.length > 0) {
                                    errors[`${formModelFieldName}[${arrayItem.key}].${arrayItemObjectPropName}`] = arrayItemObjectPropValue.errors;
                                }
                            }
                        });
                    }
                });
            } else if (FormModelValidator.objectIsMeta(formModelFieldValue) || formModelFieldName === "_modelErrors") {
                if (formModelFieldValue.errors && formModelFieldValue.errors.length > 0) {
                    errors[formModelFieldName] = formModelFieldValue.errors;
                }
            }
        });


        return errors;
    }

    // function returns true if form model has errors (validators will not be run agains form model paths)
    static hasExistingErrors(formModel) {
        let hasErrors = false;
        _.forOwn(formModel, (formModelPathValue, formModelPath) => {
            if(hasErrors === true) {
                return hasErrors;    
            }
            if (_.isArray(formModelPathValue)) {
                // this is array, loop array to get errors from array items
                formModelPathValue.forEach((arrayItem) => {
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
            } else if (FormModelValidator.objectIsMeta(formModelPathValue) || formModelPath === "_modelErrors") {
                if (formModelPathValue.errors && formModelPathValue.errors.length > 0) {
                    hasErrors = true;
                }
            }
        });
        return hasErrors;
    }

}