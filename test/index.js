import assert from 'assert'
import { createValidFormModel } from './personFormModel';
import { PersonFormModelValidators } from './personFormModelValidators';
import FormModelValidator from 'form-model-validator';
import _ from 'lodash';

const personFormModelValidators = new PersonFormModelValidators();


describe('FormModelValidator.objectIsMeta(obj) tests', function () {
    let personFormModel = createValidFormModel();

    it("'name.first' is meta", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['name.first']), true)
    );

    it("'isAdult' is meta", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['isAdult']), true)
    );

    it("'age'is meta", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['age']), true)
    );

    it("'not.meta' is not meta", () =>
        assert.equal(FormModelValidator.objectIsMeta(personFormModel['not.meta']), false)
    );
});

describe('getMetaByPath(formModel, path) tests', function () {
    let personFormModel = createValidFormModel();

    it("'name.first' returns meta", function () {
        const firstNameMeta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        assert.equal(FormModelValidator.objectIsMeta(firstNameMeta), true);
        assert.equal(firstNameMeta.value, 'John');
    });

    it("'name.incorrect' returns null", function () {
        const nullResult = FormModelValidator.getMetaByPath(personFormModel, 'name.incorrect');
        assert.equal(nullResult, null);
        assert.equal(FormModelValidator.objectIsMeta(nullResult), false);
    });

    it("'labels[key1]' returns meta", function () {
        const labelMeta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        assert.equal(FormModelValidator.objectIsMeta(labelMeta), true);
        assert.equal(labelMeta.value, 'red');
    });

    it("'emails[key1].email' returns meta", function () {
        const emailMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        assert.equal(FormModelValidator.objectIsMeta(emailMeta), true);
        assert.equal(emailMeta.value, 'john@company.com');
    });

    it("'emails[key1]' returns null", function () {
        const invalidMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1]');
        assert.equal(FormModelValidator.objectIsMeta(invalidMeta), false);
        assert.equal(invalidMeta, undefined);
    });

    it("'emails[key10].email' returns null", function () {
        const invalidMeta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key10].email');
        assert.equal(FormModelValidator.objectIsMeta(invalidMeta), false);
        assert.equal(invalidMeta, undefined);
    });
});


describe('pathIsArray(path) tests', function () {

    it("'labels[key1]' returns true", function () {
        assert.equal(FormModelValidator.pathIsArray('labels[key1]'), true);
    });

    it("'emails[key1].email' returns true", function () {
        assert.equal(FormModelValidator.pathIsArray('emails[key1].email'), true);
    });

    it("'emails.email' returns false", function () {
        assert.equal(FormModelValidator.pathIsArray('emails.email'), false);
    });
});

describe('getArrayIndex(array, key) tests', function () {
    let personFormModel = createValidFormModel();

    it("(emails, key1) returns index 0", function () {
        const indexZero = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'key1');
        assert.equal(indexZero, 0);
    });

    it("(emails, key2) returns index 1", function () {
        const indexOne = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'key2');
        assert.equal(indexOne, 1);
    });

    it("(emails, 'InvalidKey') returns -1", function () {
        const indexMinusOne = FormModelValidator.getArrayIndexByKey(personFormModel.emails, 'InvalidKey');
        assert.equal(indexMinusOne, -1);
    });

    it("(labels, 'InvalidKey') returns -1", function () {
        const indexMinusOne = FormModelValidator.getArrayIndexByKey(personFormModel.labels, 'InvalidKey');
        assert.equal(indexMinusOne, -1);
    });

});

describe('parsePathToArray(path) tests', function () {


    it("'labels[key2]' returns correct object", function () {
        const obj = FormModelValidator.parsePathToArray('labels[key2]');
        assert.equal(obj.itemKey, 'key2');
        assert.equal(obj.pathToArray, 'labels');
        assert.equal(obj.arrayItemIsMeta, true);
        assert.equal(obj.metaPropertyName, null);
        assert.equal(obj.nameOfValidatorField, 'labels[]');
    });


    it("'emails[key2].email' returns correct object", function () {
        const obj = FormModelValidator.parsePathToArray('emails[key2].email');
        assert.equal(obj.itemKey, 'key2');
        assert.equal(obj.pathToArray, 'emails');
        assert.equal(obj.arrayItemIsMeta, false);
        assert.equal(obj.metaPropertyName, 'email');
        assert.equal(obj.nameOfValidatorField, 'emails[].email');
    });
});

describe('isMetaValid(formModel, formModelValidators, path) tests for valid form model', function () {

    it("'name.first' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'name.first');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'name.last' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'name.last');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'name.last');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'age' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'age');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'age');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });


    it("'labels[key1]' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'labels[key1]');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].type' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].type');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].email' is valid", function () {
        let personFormModel = createValidFormModel();
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].email');
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });
});

describe('isMetaValid(formModel, formModelValidators, path) tests for errors/warnings/infos', function () {

    it("'name.first' has error and warning and info", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        meta.value = 'error warning info';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'name.first');
        assert.equal(isValid, false);
        assert.equal(meta.errors.length, 1);
        assert.equal(meta.warnings.length, 1);
        assert.equal(meta.infos.length, 1);
    });

    it("'name.first' has warning but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        meta.value = 'warning';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'name.first');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 1);
        assert.equal(meta.infos.length, 0);
    });

    it("'name.first' has info but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'name.first');
        meta.value = 'info';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'name.first');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 1);
    });



    it("'labels[key1]' has error", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        meta.value = 'error';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'labels[key1]');
        assert.equal(isValid, false);
        assert.equal(meta.errors.length, 1);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'labels[key1]' has warning but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        meta.value = 'warning';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'labels[key1]');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 1);
        assert.equal(meta.infos.length, 0);
    });

    it("'labels[key1]' has info but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]');
        meta.value = 'info';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'labels[key1]');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 1);
    });


    it("'emails[key1].type' has error", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        meta.value = 'error';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].type');
        assert.equal(isValid, false);
        assert.equal(meta.errors.length, 1);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].type' has warning but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        meta.value = 'warning';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].type');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 1);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].type' has info but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type');
        meta.value = 'info';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].type');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 1);
    });



    it("'emails[key1].email' has error", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        meta.value = 'error';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].email');
        assert.equal(isValid, false);
        assert.equal(meta.errors.length, 1);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].email' has warning but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        meta.value = 'warning';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].email');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 1);
        assert.equal(meta.infos.length, 0);
    });

    it("'emails[key1].email' has info but valid", function () {
        let personFormModel = createValidFormModel();
        const meta = FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email');
        meta.value = 'info';
        const isValid = FormModelValidator.isMetaValid(personFormModel, personFormModelValidators, 'emails[key1].email');
        assert.equal(isValid, true);
        assert.equal(meta.errors.length, 0);
        assert.equal(meta.warnings.length, 0);
        assert.equal(meta.infos.length, 1);
    });

});

describe('isModelValid(formModel) test for valid form model', function () {

    it("result is valid and no errors/warnings/infos are created", function () {
        let personFormModel = createValidFormModel();
        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        assert.equal(isModelValid, true);
        //first name
        assert.equal(personFormModel['name.first'].errors.length, 0);
        assert.equal(personFormModel['name.first'].warnings.length, 0);
        assert.equal(personFormModel['name.first'].infos.length, 0);
        //last name
        assert.equal(personFormModel['name.last'].errors.length, 0);
        assert.equal(personFormModel['name.last'].warnings.length, 0);
        assert.equal(personFormModel['name.last'].infos.length, 0);
        //age
        assert.equal(personFormModel['age'].errors.length, 0);
        assert.equal(personFormModel['age'].warnings.length, 0);
        assert.equal(personFormModel['age'].infos.length, 0);
        //labels[0]
        assert.equal(personFormModel['labels'][0].errors.length, 0);
        assert.equal(personFormModel['labels'][0].warnings.length, 0);
        assert.equal(personFormModel['labels'][0].infos.length, 0);
        //labels[1]
        assert.equal(personFormModel['labels'][1].errors.length, 0);
        assert.equal(personFormModel['labels'][1].warnings.length, 0);
        assert.equal(personFormModel['labels'][1].infos.length, 0);
        //emails[0].type
        assert.equal(personFormModel['emails'][0].type.errors.length, 0);
        assert.equal(personFormModel['emails'][0].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].type.infos.length, 0);
        //emails[0].email
        assert.equal(personFormModel['emails'][0].email.errors.length, 0);
        assert.equal(personFormModel['emails'][0].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].email.infos.length, 0);
        //emails[1].type
        assert.equal(personFormModel['emails'][1].type.errors.length, 0);
        assert.equal(personFormModel['emails'][1].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].type.infos.length, 0);
        //emails[1].email
        assert.equal(personFormModel['emails'][1].email.errors.length, 0);
        assert.equal(personFormModel['emails'][1].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].email.infos.length, 0);
        //_meta
        assert.equal(personFormModel['_model'].errors.length, 0);
        assert.equal(personFormModel['_model'].warnings.length, 0);
        assert.equal(personFormModel['_model'].infos.length, 0);
    });
});

describe('isModelValid(formModel) test for invalid form model (errors)', function () {

    it("result is invalid and only errors are created", function () {
        let personFormModel = createValidFormModel();
        // setting errors to all fields
        personFormModel['name.first'].value = 'error meta_err meta_warn meta_inf';
        personFormModel['name.last'].value = 'error';
        personFormModel['age'].value = 1;

        personFormModel['labels'][0].value = 'error';
        personFormModel['labels'][1].value = 'error';

        personFormModel['emails'][0].type.value = 'error';
        personFormModel['emails'][0].email.value = 'error';

        personFormModel['emails'][1].type.value = 'error';
        personFormModel['emails'][1].email.value = 'error';

        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        assert.equal(isModelValid, false);
        assert.equal(personFormModel['name.first'].errors.length, 1);
        assert.equal(personFormModel['name.first'].warnings.length, 0);
        assert.equal(personFormModel['name.first'].infos.length, 0);
        //last name
        assert.equal(personFormModel['name.last'].errors.length, 1);
        assert.equal(personFormModel['name.last'].warnings.length, 0);
        assert.equal(personFormModel['name.last'].infos.length, 0);
        // //age
        assert.equal(personFormModel['age'].errors.length, 1);
        assert.equal(personFormModel['age'].warnings.length, 0);
        assert.equal(personFormModel['age'].infos.length, 0);
        //labels[0]
        assert.equal(personFormModel['labels'][0].errors.length, 1);
        assert.equal(personFormModel['labels'][0].warnings.length, 0);
        assert.equal(personFormModel['labels'][0].infos.length, 0);
        //labels[1]
        assert.equal(personFormModel['labels'][1].errors.length, 1);
        assert.equal(personFormModel['labels'][1].warnings.length, 0);
        assert.equal(personFormModel['labels'][1].infos.length, 0);
        //emails[0].type
        assert.equal(personFormModel['emails'][0].type.errors.length, 1);
        assert.equal(personFormModel['emails'][0].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].type.infos.length, 0);
        //emails[0].email
        assert.equal(personFormModel['emails'][0].email.errors.length, 1);
        assert.equal(personFormModel['emails'][0].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].email.infos.length, 0);
        //emails[1].type
        assert.equal(personFormModel['emails'][1].type.errors.length, 1);
        assert.equal(personFormModel['emails'][1].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].type.infos.length, 0);
        //emails[1].email
        assert.equal(personFormModel['emails'][1].email.errors.length, 1);
        assert.equal(personFormModel['emails'][1].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].email.infos.length, 0);
        //_meta
        assert.equal(personFormModel['_model'].errors.length, 2);
        assert.equal(personFormModel['_model'].warnings.length, 1);
        assert.equal(personFormModel['_model'].infos.length, 1);
    });
});

describe('isModelValid(formModel) test for invalid form model (warnings)', function () {

    it("result is valid and only warnings are created", function () {
        let personFormModel = createValidFormModel();
        // setting errors to all fields
        personFormModel['name.first'].value = 'warning';
        personFormModel['name.last'].value = 'warning';
        personFormModel['age'].value = 2;

        personFormModel['labels'][0].value = 'warning';
        personFormModel['labels'][1].value = 'warning';

        personFormModel['emails'][0].type.value = 'warning';
        personFormModel['emails'][0].email.value = 'warning';

        personFormModel['emails'][1].type.value = 'warning';
        personFormModel['emails'][1].email.value = 'warning';

        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        assert.equal(isModelValid, true);
        assert.equal(personFormModel['name.first'].errors.length, 0);
        assert.equal(personFormModel['name.first'].warnings.length, 1);
        assert.equal(personFormModel['name.first'].infos.length, 0);
        //last name
        assert.equal(personFormModel['name.last'].errors.length, 0);
        assert.equal(personFormModel['name.last'].warnings.length, 1);
        assert.equal(personFormModel['name.last'].infos.length, 0);
        // //age
        assert.equal(personFormModel['age'].errors.length, 0);
        assert.equal(personFormModel['age'].warnings.length, 1);
        assert.equal(personFormModel['age'].infos.length, 0);
        //labels[0]
        assert.equal(personFormModel['labels'][0].errors.length, 0);
        assert.equal(personFormModel['labels'][0].warnings.length, 1);
        assert.equal(personFormModel['labels'][0].infos.length, 0);
        //labels[1]
        assert.equal(personFormModel['labels'][1].errors.length, 0);
        assert.equal(personFormModel['labels'][1].warnings.length, 1);
        assert.equal(personFormModel['labels'][1].infos.length, 0);
        //emails[0].type
        assert.equal(personFormModel['emails'][0].type.errors.length, 0);
        assert.equal(personFormModel['emails'][0].type.warnings.length, 1);
        assert.equal(personFormModel['emails'][0].type.infos.length, 0);
        //emails[0].email
        assert.equal(personFormModel['emails'][0].email.errors.length, 0);
        assert.equal(personFormModel['emails'][0].email.warnings.length, 1);
        assert.equal(personFormModel['emails'][0].email.infos.length, 0);
        //emails[1].type
        assert.equal(personFormModel['emails'][1].type.errors.length, 0);
        assert.equal(personFormModel['emails'][1].type.warnings.length, 1);
        assert.equal(personFormModel['emails'][1].type.infos.length, 0);
        //emails[1].email
        assert.equal(personFormModel['emails'][1].email.errors.length, 0);
        assert.equal(personFormModel['emails'][1].email.warnings.length, 1);
        assert.equal(personFormModel['emails'][1].email.infos.length, 0);
    });
});

describe('isModelValid(formModel) test for invalid form model (infos)', function () {

    it("result is valid and only infos are created", function () {
        let personFormModel = createValidFormModel();
        // setting errors to all fields
        personFormModel['name.first'].value = 'info';
        personFormModel['name.last'].value = 'info';
        personFormModel['age'].value = 3;

        personFormModel['labels'][0].value = 'info';
        personFormModel['labels'][1].value = 'info';

        personFormModel['emails'][0].type.value = 'info';
        personFormModel['emails'][0].email.value = 'info';

        personFormModel['emails'][1].type.value = 'info';
        personFormModel['emails'][1].email.value = 'info';

        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        assert.equal(isModelValid, true);
        assert.equal(personFormModel['name.first'].errors.length, 0);
        assert.equal(personFormModel['name.first'].warnings.length, 0);
        assert.equal(personFormModel['name.first'].infos.length, 1);
        //last name
        assert.equal(personFormModel['name.last'].errors.length, 0);
        assert.equal(personFormModel['name.last'].warnings.length, 0);
        assert.equal(personFormModel['name.last'].infos.length, 1);
        // //age
        assert.equal(personFormModel['age'].errors.length, 0);
        assert.equal(personFormModel['age'].warnings.length, 0);
        assert.equal(personFormModel['age'].infos.length, 1);
        //labels[0]
        assert.equal(personFormModel['labels'][0].errors.length, 0);
        assert.equal(personFormModel['labels'][0].warnings.length, 0);
        assert.equal(personFormModel['labels'][0].infos.length, 1);
        //labels[1]
        assert.equal(personFormModel['labels'][1].errors.length, 0);
        assert.equal(personFormModel['labels'][1].warnings.length, 0);
        assert.equal(personFormModel['labels'][1].infos.length, 1);
        //emails[0].type
        assert.equal(personFormModel['emails'][0].type.errors.length, 0);
        assert.equal(personFormModel['emails'][0].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].type.infos.length, 1);
        //emails[0].email
        assert.equal(personFormModel['emails'][0].email.errors.length, 0);
        assert.equal(personFormModel['emails'][0].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][0].email.infos.length, 1);
        //emails[1].type
        assert.equal(personFormModel['emails'][1].type.errors.length, 0);
        assert.equal(personFormModel['emails'][1].type.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].type.infos.length, 1);
        //emails[1].email
        assert.equal(personFormModel['emails'][1].email.errors.length, 0);
        assert.equal(personFormModel['emails'][1].email.warnings.length, 0);
        assert.equal(personFormModel['emails'][1].email.infos.length, 1);
    });
});

describe('getOrCreateNestedObjects(obj, path) tests', function () {

    it("({}, 'contact.name.first') correctly creates nested objects", function () {

        let json = {};
        let nestedObject = FormModelValidator.getOrCreateNestedObjects(json, 'contact.name.first');
        assert.equal(typeof (json.contact), 'object');
        assert.equal(typeof (json.contact.name), 'object');
        assert.equal(nestedObject.first, undefined);
    });

    it("({ name: { first: 'John' } }, 'name.first') correctly gets existing nested objects", function () {

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
});

describe('getOrCreateNestedObjects(obj, path) tests', function () {

    it("({}, 'contact.addresses') correctly creates nested array", function () {

        let json = {};
        let nestedArray = FormModelValidator.getOrCreateNestedArray(json, 'contact.addresses');
        assert.equal(typeof (json.contact), 'object');
        assert.equal(_.isArray(json.contact), false);
        assert.equal(_.isArray(json.contact.addresses), true);
        assert.equal(_.isArray(nestedArray), true);
        assert.equal(nestedArray.length, 0);
    });

    it("({ addresses: [ 'item 1' ] }, 'contact.addresses') correctly gets nested array", function () {

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

describe('getJSON(formModel,formModelValidators) tests', function () {

    it("(formModel, formModelValidators) correctly build json", function () {
        let personFormModel = createValidFormModel();
        personFormModel['_model'] = {};
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

        // '_meta' should not be added to json
        assert.equal(json['_model'], undefined);


    });


    it("(formModel, formModelValidators) correctly build json with custom json builder", function () {
        let personFormModel = createValidFormModel();
        let customPersonFormModelValidators = new PersonFormModelValidators();
        // building custom json for labels
        customPersonFormModelValidators['labels[].getJSON'] = (arrayItem, formModel) => {
            return { 
                key: arrayItem.key, 
                value: arrayItem.value + '_changed' 
            }
        };
        // building custom json for labels
        customPersonFormModelValidators['emails[].getJSON'] = (arrayItem, formModel) => {
            return {
                key: arrayItem.key,
                value: { 
                    type: arrayItem.type.value + '_changed', 
                    email: arrayItem.email.value + '_changed' 
                }
            }
        };
        // building custom json for first name
        customPersonFormModelValidators['name.first.getJSON'] = (meta, formModel) => {
            return meta.value + '_changed'            
        };


        personFormModelValidators['name.first']
        personFormModel['_model'] = {};
        let json = FormModelValidator.getJSON(personFormModel, customPersonFormModelValidators);
        //console.log(json);
        assert.equal(json.name.first, 'John_changed');
        assert.equal(json.name.last, 'Brown');
        assert.equal(json.isAdult, true);
        assert.equal(json.age, 30);

        // array of emails
        assert.equal(json.emails.length, 2);
        assert.equal(json.emails[0].key, 'key1');
        assert.equal(json.emails[0].value.type, 'Work_changed');
        assert.equal(json.emails[0].value.email, 'john@company.com_changed');
        assert.equal(json.emails[1].key, 'key2');
        assert.equal(json.emails[1].value.type, 'Personal_changed');
        assert.equal(json.emails[1].value.email, 'john@gmail.com_changed');

        // array of labels
        assert.equal(json.labels.length, 2);
        assert.equal(json.labels[0].key, 'key1');
        assert.equal(json.labels[0].value, 'red_changed');
        assert.equal(json.labels[1].key, 'key2');
        assert.equal(json.labels[1].value, 'blue_changed');

        // '_meta' should not be added to json
        assert.equal(json['_model'], undefined);


    });

});

describe('getErrors(formModel) tests', function () {
    it("invalid form model returns errors object", function () {
        let personFormModel = createValidFormModel();
        // setting errors to all fields
        personFormModel['name.first'].value = 'error warning info meta_err meta_warn meta_inf';
        personFormModel['name.last'].value = 'error info';
        personFormModel['age'].value = 1;

        personFormModel['labels'][0].value = 'error warning';
        personFormModel['labels'][1].value = 'error info';

        personFormModel['emails'][0].type.value = 'error warning';
        personFormModel['emails'][0].email.value = 'error warning';

        personFormModel['emails'][1].type.value = 'error info';
        personFormModel['emails'][1].email.value = 'error info';

        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        const errObj = FormModelValidator.getErrors(personFormModel);

        assert.equal(errObj['name.first'].errors.length, 1);
        assert.equal(errObj['name.first'].warnings.length, 1);
        assert.equal(errObj['name.first'].infos.length, 1);

        assert.equal(errObj['name.last'].errors.length, 1);
        assert.equal(errObj['name.last'].warnings, undefined);
        assert.equal(errObj['name.last'].infos.length, 1);

        assert.equal(errObj['age'].errors.length, 1);
        assert.equal(errObj['age'].warnings, undefined);
        assert.equal(errObj['age'].infos, undefined);

        assert.equal(errObj['labels[key1]'].errors.length, 1);
        assert.equal(errObj['labels[key1]'].warnings.length, 1);
        assert.equal(errObj['labels[key1]'].infos, undefined);

        assert.equal(errObj['labels[key2]'].errors.length, 1);
        assert.equal(errObj['labels[key2]'].warnings, undefined);
        assert.equal(errObj['labels[key2]'].infos.length, 1);

        assert.equal(errObj['emails[key1].type'].errors.length, 1);
        assert.equal(errObj['emails[key1].type'].warnings.length, 1);
        assert.equal(errObj['emails[key1].type'].infos, undefined);
        assert.equal(errObj['emails[key1].email'].errors.length, 1);
        assert.equal(errObj['emails[key1].email'].warnings.length, 1);
        assert.equal(errObj['emails[key1].email'].infos, undefined);

        assert.equal(errObj['emails[key2].type'].errors.length, 1);
        assert.equal(errObj['emails[key2].type'].warnings, undefined);
        assert.equal(errObj['emails[key2].type'].infos.length, 1);
        assert.equal(errObj['emails[key2].email'].errors.length, 1);
        assert.equal(errObj['emails[key2].email'].warnings, undefined);
        assert.equal(errObj['emails[key2].email'].infos.length, 1);

        assert.equal(errObj['_model'].errors.length, 2);
        assert.equal(errObj['_model'].warnings.length, 1);
        assert.equal(errObj['_model'].infos.length, 1);

    });


    it("valid form model returns empty errors object", function () {
        let personFormModel = createValidFormModel();
        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        const errObj = FormModelValidator.getErrors(personFormModel);


        assert.equal(errObj['name.first'], undefined);
        assert.equal(errObj['name.last'], undefined);
        assert.equal(errObj['age'], undefined);
        assert.equal(errObj['labels[key1]'], undefined);
        assert.equal(errObj['labels[key2]'], undefined);
        assert.equal(errObj['emails[key1].type'], undefined);
        assert.equal(errObj['emails[key1].email'], undefined);
        assert.equal(errObj['emails[key2].type'], undefined);
        assert.equal(errObj['emails[key2].email'], undefined);
        assert.equal(errObj['_model'], undefined);

    });

});

describe('replaceErrors(formModel, errorObj) tests', function () {
    it("formModel contains new errors, warnings and infos", function () {
        
        // make invalid form model and get errors object for that form model
        let invalidPersonFormModel = createValidFormModel();
        // setting errors to all fields
        invalidPersonFormModel['name.first'].value = 'error warning info meta_err meta_warn meta_inf';
        invalidPersonFormModel['name.last'].value = 'error info';
        invalidPersonFormModel['age'].value = 1;

        invalidPersonFormModel['labels'][0].value = 'error warning';
        invalidPersonFormModel['labels'][1].value = 'error info';

        invalidPersonFormModel['emails'][0].type.value = 'error warning';
        invalidPersonFormModel['emails'][0].email.value = 'error warning';

        invalidPersonFormModel['emails'][1].type.value = 'error info';
        invalidPersonFormModel['emails'][1].email.value = 'error info';

        const isModelValid = FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);
        const errObj = FormModelValidator.getErrors(invalidPersonFormModel);


        // create valid form model and replace errors
        let personFormModel = createValidFormModel();
        FormModelValidator.replaceErrors(personFormModel, errObj);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.first').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.first').warnings.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.first').infos.length, 1);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.last').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.last').warnings, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'name.last').infos.length, 1);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'age').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'age').warnings, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'age').infos, undefined);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]').warnings.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key1]').infos, undefined);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key2]').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key2]').warnings, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'labels[key2]').infos.length, 1);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type').warnings.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].type').infos, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email').warnings.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key1].email').infos, undefined);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].type').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].type').warnings, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].type').infos.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].email').errors.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].email').warnings, undefined);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, 'emails[key2].email').infos.length, 1);

        assert.equal(FormModelValidator.getMetaByPath(personFormModel, '_model').errors.length, 2);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, '_model').warnings.length, 1);
        assert.equal(FormModelValidator.getMetaByPath(personFormModel, '_model').infos.length, 1);

    });
});

describe('hasExistingErrors(formModel) tests', function () {
    it("valid form model has no errors", function () {
        // make invalid form model and get errors object for that form model
        let personFormModel = createValidFormModel();
        const isModelValid = FormModelValidator.isModelValid(personFormModel, personFormModelValidators);
        let hasErrors = FormModelValidator.hasExistingErrors(personFormModel);
        assert.equal(hasErrors, false);
    });

     it("invalid form model has errors", function () {
        // make invalid form model and get errors object for that form model
        let invalidPersonFormModel = createValidFormModel();
        // setting errors to all fields
        invalidPersonFormModel['name.first'].value = 'error warning info meta_err meta_warn meta_inf';
        invalidPersonFormModel['name.last'].value = 'error info';
        invalidPersonFormModel['age'].value = 1;

        invalidPersonFormModel['labels'][0].value = 'error warning';
        invalidPersonFormModel['labels'][1].value = 'error info';

        invalidPersonFormModel['emails'][0].type.value = 'error warning';
        invalidPersonFormModel['emails'][0].email.value = 'error warning';

        invalidPersonFormModel['emails'][1].type.value = 'error info';
        invalidPersonFormModel['emails'][1].email.value = 'error info';

        const isModelValid = FormModelValidator.isModelValid(invalidPersonFormModel, personFormModelValidators);
        let hasErrors = FormModelValidator.hasExistingErrors(invalidPersonFormModel);
        assert.equal(hasErrors, true);
    });
});