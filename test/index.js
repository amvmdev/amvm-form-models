import assert from 'assert'
import { personFormModel } from './personFormModel';
import { invalidPersonFormModel } from './invalidPersonFormModel';
import { PersonFormModelValidators } from './personFormModelValidators';
import FormModelValidator from 'form-model-validator';
import _ from 'lodash';

const personFormModelValidators = new PersonFormModelValidators();


describe('Object is meta', function () {

    it("FormModelValidator.objectIsMeta(personFormModel['name.first']) is meta (meta value is string)", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['name.first']), true)
    );

    it("FormModelValidator.objectIsMeta(personFormModel['isAdult']) is meta (meta value is boolean)", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['isAdult']), true)
    );

    it("FormModelValidator.objectIsMeta(personFormModel['age']) is meta (meta value is number)", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['age']), true)
    );

    it("FormModelValidator.objectIsMeta(personFormModel['not.meta']) is not meta", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['not.meta']), false)
    );
});

describe('Retrieving meta object', function () {

    it("FormModelValidator.getMetaByPath(personFormModel, 'name.first') returns meta with correct value", function () {
        const firstNameMeta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        assert.equal(FormModelValidator.objectIsMeta(firstNameMeta), true);
        assert.equal(firstNameMeta.value, 'John');
    });

    it("FormModelValidator.getMetaByPath(personFormModel, 'name.incorrect') returns null", function () {
        const nullResult = FormModelValidator.getMetaByPath(personFormModel, 'name.incorrect');
        assert.equal(nullResult, null);
        assert.equal(FormModelValidator.objectIsMeta(nullResult), false);
    });

    it("FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]') returns meta", function () {
        const labelMeta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        assert.equal(FormModelValidator.objectIsMeta(labelMeta), true);
        assert.equal(labelMeta.value, 'red');
    });

    it("FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email') returns meta", function () {
        const emailMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        assert.equal(FormModelValidator.objectIsMeta(emailMeta), true);
        assert.equal(emailMeta.value, 'john@company.com');
    });

    it("FormModelValidator.getMetaByPath(personFormModel, 'emails[key1]') returns null", function () {
        const invalidMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1]');
        assert.equal(FormModelValidator.objectIsMeta(invalidMeta), false);
        assert.equal(invalidMeta, undefined);
    });
});


describe('Field name is array and get correct index by key', function () {
    it("FormModelValidator.fieldNameIsArray('labels[key1]') returns true", function () {
        assert.equal(FormModelValidator.fieldNameIsArray('labels[key1]'), true);
    });

    it("FormModelValidator.fieldNameIsArray('emails[key1].email') returns true", function () {
        assert.equal(FormModelValidator.fieldNameIsArray('emails[key1].email'), true);
    });

    it("FormModelValidator.getArrayIndex(personFormModel.emails, 'key1') returns index 0", function () {
        const indexZero = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'key1');
        assert.equal(indexZero, 0);
    });

    it("FormModelValidator.getArrayIndex(personFormModel.emails, 'key2') returns index 1", function () {
        const indexOne = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'key2');
        assert.equal(indexOne, 1);
    });

    it("FormModelValidator.getArrayIndex(formModelArray, 'InvalidKey') returns -1 for non-existing key", function () {
        const indexMinusOne = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'InvalidKey');
        assert.equal(indexMinusOne, -1);
    });

    it("FormModelValidator.getArrayIndex(personFormModel.tags, 'key1') returns index 0", function () {
        const index = FormModelValidator.getArrayIndexByKey(personFormModel.tags, 'key1');
        assert.equal(index, 0);
    });

});


describe('Array of single meta objects', function () {

    it("FormModelValidator.getMetaByPath(formModel, 'labels[key1]') returns meta for path to array", function () {
        const labelMeta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        assert.equal(FormModelValidator.objectIsMeta(labelMeta), true);
        assert.equal(labelMeta.value, 'red');
    });

    it("FormModelValidator.parseFieldNameToArray('labels[key2]') returns correct object", function () {
        const obj = FormModelValidator.parseFieldNameToArray('labels[key2]');
        assert.equal(obj.itemKey, 'key2');
        assert.equal(obj.pathToArray, 'labels');
        assert.equal(obj.arrayItemIsMeta, true);
        assert.equal(obj.metaPropertyName, null);
        assert.equal(obj.nameOfValidatorField, 'labels[]');
    });
});

describe('Array of multiple meta objects', function () {

    it("FormModelValidator.getMetaByPath(formModel, 'emails[key1].type') returns meta for path to array", function () {
        const typeMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        assert.equal(FormModelValidator.objectIsMeta(typeMeta), true);
        assert.equal(typeMeta.value, 'Work');
    });

    it("FormModelValidator.getMetaByPath(formModel, 'emails[key2].email') returns meta for path to array", function () {
        const typeMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].email');
        assert.equal(FormModelValidator.objectIsMeta(typeMeta), true);
        assert.equal(typeMeta.value, 'john@gmail.com');
    });

    it("FormModelValidator.parseFieldNameToArray('emails[key2].email') returns correct object", function () {
        const obj = FormModelValidator.parseFieldNameToArray('emails[key2].email');
        assert.equal(obj.itemKey, 'key2');
        assert.equal(obj.pathToArray, 'emails');
        assert.equal(obj.arrayItemIsMeta, false);
        assert.equal(obj.metaPropertyName, 'email');
        assert.equal(obj.nameOfValidatorField, 'emails[].email');
    });

});


describe('Validating meta objects', function () {

    it("isFieldValid(personFormModel, personFormModelValidators, 'name.first') is valid", function () {
        const isValid = FormModelValidator.isFieldValid(personFormModel, personFormModelValidators, 'name.first');
        assert.equal(isValid, true);
    });

    it("isFieldValid(personFormModel, personFormModelValidators, 'name.last') is valid", function () {
        const isValid = FormModelValidator.isFieldValid(personFormModel, personFormModelValidators, 'name.last');
        assert.equal(isValid, true);
    });

    it("isFieldValid(invalidPersonFormModel, personFormModelValidators, 'name.last') is not valid", function () {
        const isValid = FormModelValidator.isFieldValid(invalidPersonFormModel, personFormModelValidators, 'name.last');
        assert.equal(isValid, false);
    });

    it("invalidPersonFormModel['name.last'] has 1 error after validation", function () {
        const lastNameMeta = FormModelValidator.getMetaByPath(invalidPersonFormModel, 'name.last');        
        assert.equal(lastNameMeta.errors.length, 1);
        assert.equal(lastNameMeta.errors[0], 'Last name is required');
    });

    it("invalidPersonFormModel['name.last'] has 1 error after changing value and running validation", function () {
        // set last name to '123456789'
        const lastNameMeta = FormModelValidator.getMetaByPath(invalidPersonFormModel, 'name.last');
        lastNameMeta.value = '1234567890';

        const isValid = FormModelValidator.isFieldValid(invalidPersonFormModel, personFormModelValidators, 'name.last');
        assert.equal(lastNameMeta.errors.length, 1);
        assert.equal(lastNameMeta.errors[0], 'Last name cannot be 1234567890');
    });

});


describe('Validating array of meta objects', function () {

    it("isFieldValid(personFormModel, personFormModelValidators, 'labels[key1]') is valid", function () {
        const isValid = FormModelValidator.isFieldValid(personFormModel, personFormModelValidators, 'labels[key1]');
        assert.equal(isValid, true);
    });    

    it("isFieldValid(personFormModel, personFormModelValidators, 'emails[key1].type') is valid and has no errors", function () {
        const isValid = FormModelValidator.isFieldValid(personFormModel, personFormModelValidators, 'emails[key1].type');
        assert.equal(isValid, true);
        const typeMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        assert.equal(typeMeta.errors.length, 0);
    });

    it("isFieldValid(personFormModel, personFormModelValidators, 'emails[key1].email') is valid and has no errors", function () {
        const isValid = FormModelValidator.isFieldValid(personFormModel, personFormModelValidators, 'emails[key1].email');
        assert.equal(isValid, true);
        const emailMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        assert.equal(emailMeta.errors.length, 0);
    });

    it("isFieldValid(invalidPersonFormModel, personFormModelValidators, 'labels[key3]') is not valid and has errors", function () {
        const isValid = FormModelValidator.isFieldValid(invalidPersonFormModel, personFormModelValidators, 'labels[key3]');
        assert.equal(isValid, false);
        const labelMeta = FormModelValidator.getMetaByPath(invalidPersonFormModel, 'labels[key3]');
        assert.equal(labelMeta.errors.length, 1);
    });

    it("isFieldValid(invalidPersonFormModel, personFormModelValidators, 'emails[key3].type') is not valid and has errors", function () {
        const isValid = FormModelValidator.isFieldValid(invalidPersonFormModel, personFormModelValidators, 'emails[key3].type');
        assert.equal(isValid, false);
        const typeMeta = FormModelValidator.getMetaByPath(invalidPersonFormModel, 'emails[key3].type');
        assert.equal(typeMeta.errors.length, 1);
    });

    it("isFieldValid(invalidPersonFormModel, personFormModelValidators, 'emails[key3].email') is not valid and has errors", function () {
        const isValid = FormModelValidator.isFieldValid(invalidPersonFormModel, personFormModelValidators, 'emails[key3].email');
        assert.equal(isValid, false);
        const emailMeta = FormModelValidator.getMetaByPath(invalidPersonFormModel, 'emails[key3].email');
        assert.equal(emailMeta.errors.length, 1);
    });

});


describe('Validating form model', function () {
    
    it("isModelValid(personFormModel, personFormModelValidators) returns true", function () {
        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        assert.equal(isModelValid, true);
    });

    it("personFormModel does not have errors inside '_modelErrors' property after validating whole form", function () {
        assert.equal(personFormModel['_modelErrors'].errors.length, 0);
    });


    it("isModelValid(invalidPersonFormModel, personFormModelValidators) returns false", function () {
        const isModelValid = FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);
        assert.equal(isModelValid, false);
    });

    it("invalidPersonFormModel has '_modelErrors' property after validating whole form", function () {
        assert.notEqual(invalidPersonFormModel['_modelErrors'], undefined);
        assert.equal(invalidPersonFormModel['_modelErrors'].errors.length, 1);
    });

});


describe('Creating nested objects and arrays', function () {

    it("getOrCreateNestedObjects({}, 'contact.name.first') correctly creates nested objects", function () {

        let json = {};
        let nestedObject = FormModelValidator.getOrCreateNestedObjects(json, 'contact.name.first');
        assert.equal(typeof (json.contact), 'object');
        assert.equal(typeof (json.contact.name), 'object');
        assert.equal(nestedObject.first, undefined);
    });

    it("getOrCreateNestedObjects({ name: { first: 'John' } }, 'name.first') correctly gets existing nested objects", function () {

        let json = {
            name: {
                first: 'John'
            }
        };
        let nameObject = FormModelValidator.getOrCreateNestedObjects(json, 'name.first');
        assert.equal(typeof (json.name), 'object');
        assert.equal(json.name.first, 'John');
        assert.equal(nameObject.first, 'John');
    });


    it("getOrCreateNestedArray({}, 'contact.addresses') correctly creates nested array", function () {

        let json = {};
        let nestedArray = FormModelValidator.getOrCreateNestedArray(json, 'contact.addresses');
        assert.equal(typeof (json.contact), 'object');
        assert.equal(_.isArray(json.contact), false);
        assert.equal(_.isArray(json.contact.addresses), true);
        assert.equal(_.isArray(nestedArray), true);
        assert.equal(nestedArray.length, 0);
    });

    it("getOrCreateNestedArray({ addresses: [ 'item 1' ] }, 'contact.addresses') correctly gets nested array", function () {

        let json = {
            contact: {
                addresses: [
                    'item 1'
                ]
            }
        };
        let nestedObject = FormModelValidator.getOrCreateNestedArray(json, 'contact.addresses');
        assert.equal(typeof (json.contact), 'object');
        assert.equal(_.isArray(json.contact), false);
        assert.equal(_.isArray(json.contact.addresses), true);
        assert.equal(nestedObject.length, 1);
        assert.equal(nestedObject[0], 'item 1');
    });


});


describe('Creating JSON', function () {

    it("getJSON(personFormModel, personFormModelValidators) correctly build json", function () {

        let json = FormModelValidator.getJSON(personFormModel, personFormModelValidators);        
        assert.equal(json.name.first, 'John');
        assert.equal(json.name.last, 'Brown');
        assert.equal(json.isAdult, true);
        assert.equal(json.age, 30);
        
        // array of emails
        assert.equal(json.emails.length, 2);                
        assert.equal(json.emails[0].key, 'key1');
        assert.equal(json.emails[0].value.type, 'Work');
        assert.equal(json.emails[0].value.email, 'john@company.com');
        assert.equal(json.emails[1].key, 'key2');
        assert.equal(json.emails[1].value.type, 'Personal');
        assert.equal(json.emails[1].value.email, 'john@gmail.com');
        
        // array of labels
        assert.equal(json.labels.length, 2);
        assert.equal(json.labels[0].key, 'key1');
        assert.equal(json.labels[0].value, 'red');
        assert.equal(json.labels[1].key, 'key2');
        assert.equal(json.labels[1].value, 'blue');

        //console.log(json);
    });

});


describe('Get, check and replace errors', function () {

    it("getErrors(invalidPersonFormModel) returns errors", function () {

        // validate form to set errors
        FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);

        const errors = FormModelValidator.getErrors(invalidPersonFormModel);
        assert.equal(_.isObject(errors), true);
        assert.equal(errors['name.last'].length, 1);
        assert.equal(errors['emails[key3].type'].length, 1);
        assert.equal(errors['emails[key3].email'].length, 1);
        assert.equal(errors['labels[key3]'].length, 1);
        assert.equal(errors['_modelErrors'].length, 1);        
    });


    it("hasExistingErrors(invalidPersonFormModel) returns true", function () {

        // validate form to set errors
        FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);
        const hasErrors = FormModelValidator.hasExistingErrors(invalidPersonFormModel);        
        assert.equal(hasErrors, true);        
        
    });


    it("replaceErrors(errorsObject) correctly replaces errors in form model", function () {

        // validate form to set errors
        FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);

        // change errors object (emulating that errors came from server)
        const serverErrors = FormModelValidator.getErrors(invalidPersonFormModel);
        serverErrors['name.last'] = [ 'name.last server error'];
        serverErrors['emails[key3].type'] = [ 'emails[key3].type server error'];
        serverErrors['emails[key3].email'] = [ 'emails[key3].email server error'];
        serverErrors['labels[key3]'] = [ 'labels[key3] server error'];
        serverErrors['_modelErrors'] = [ '_modelErrors server error'];

        // replace errors in form model
        FormModelValidator.replaceErrors(invalidPersonFormModel, serverErrors);


        // get errors from form model
        const newFormModelErrors = FormModelValidator.getErrors(invalidPersonFormModel);
        assert.equal(newFormModelErrors['name.last'][0], 'name.last server error');
        assert.equal(newFormModelErrors['emails[key3].type'][0], 'emails[key3].type server error');
        assert.equal(newFormModelErrors['emails[key3].email'][0], 'emails[key3].email server error');
        assert.equal(newFormModelErrors['labels[key3]'][0], 'labels[key3] server error');
        assert.equal(newFormModelErrors['_modelErrors'][0], '_modelErrors server error');



    });

});