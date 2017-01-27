import FormModelValidator from './form-model-validator';

export function createFullModel(json, fnFormModel, fnFormModelValidators, fnFullModel, fnPostProcess) {
    /*
    {   
        isValid: true if we can validate json
        json: this json will go into database
        errors: object with errors if validation fails
        formModel: form model created from json
    }
    */

    let result = {
        isValid: false,
        json: null,
        errors: null,
        formModel: null
    };


    // create form model from raw data
    let formModel = new fnFormModel(json);

    // save result of validating form model
    result.isValid = FormModelValidator.isModelValid(formModel, new fnFormModelValidators());
    result.formModel = formModel;

    if (!result.isValid) {
        // if form model is not valid, then create object with errors for that model.
        // this error object will be send to client to display validation errors
        result.errors = FormModelValidator.getErrors(formModel);

        // set flag that model is invalid
        result.isValid = false;
    }
    else {
        // form model is valid, then create json that will be saved into database (with metadata)

        // get json from form model (this way we get only json that we expect)
        let jsonFromFormModel = FormModelValidator.getJSON(formModel, new fnFormModelValidators());

        // this json contains all fields for that domain model        
        let fullModelJson = new fnFullModel(jsonFromFormModel);

        // call function that may modify json document
        if (fnPostProcess && typeof fnPostProcess === 'function') {
            fnPostProcess(fullModelJson);
        }

        // Finally, after all checks, we return json on full model with meta data added to it            
        result.json = fullModelJson;
        result.isValid = true;
    }

    return result;
}



export function createFormModel(json, fnFormModel, fnFormModelValidators, fnPostProcess) {
    /*
    {   
        isValid: true if we can validate json
        json: json with metadata. This json will go into database
        errors: object with errors if validation fails  
        formModel: form model created from json      
    }
    */

    let result = {
        isValid: false,
        json: null,
        errors: null,
        formModel: null
    };


    // create form model from raw data
    let formModel = new fnFormModel(json);

    // save result of validating form model
    result.isValid = FormModelValidator.isModelValid(formModel, new fnFormModelValidators());
    result.formModel = formModel;
    if (!result.isValid) {
        // if form model is not valid, then create object with errors for that model.
        // this error object will be send to client to display validation errors
        result.errors = FormModelValidator.getErrors(formModel);

        // set flag that model is invalid
        result.isValid = false;
    }
    else {
        // form model is valid, then create json that will be saved into database (with metadata)

        // get json from form model (this way we get only json that we expect)
        let jsonFromFormModel = FormModelValidator.getJSON(formModel, new fnFormModelValidators());

        // call function that may modify json document
        if (fnPostProcess && typeof fnPostProcess === 'function') {
            fnPostProcess(jsonFromFormModel);
        }

        // Finally, after all checks, we return json on full model with meta data added to it            
        result.json = jsonFromFormModel;
        result.isValid = true;
    }
    return result;
}