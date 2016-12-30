import assert from 'assert'
import { personFormModel } from './personFormModel';

import FormModelValidator from 'form-model-validator';


describe('Meta object', function () {

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
});


describe('Form model array', function () {
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
        assert.equal(typeMeta.value, 'john@home.com');
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