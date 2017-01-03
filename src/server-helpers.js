import FormModelValidator from './form-model-validator';

export function createFullModel(json, fnFormModel, fnFormModelValidators, fnFullModel, httpRequest) {
    /*
    {   
        isValid: true if we can validate json
        json: json with meta property. This json will go into database
        errors: object with errors if validation fails        
    }
    */

    let result = {
        isValid: false,
        json: null,
        errors: null
    };


    // create form model from raw data
    let formModel = new fnFormModel(json);

    // save result of validating form model
    result.isValid = FormModelValidator.isModelValid(formModel, new fnFormModelValidators());
    
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
         
        delete fullModelJson.meta; // delete meta in case it exists
        delete fullModelJson._id; // if we don't delete _id, new record will be created with empty _id

        // Important! - create meta property on json that points to who is owning this data!!!
        // Also get additional info
        const ip = httpRequest.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const userAgent = httpRequest.headers['user-agent'];
        fullModelJson.meta = {
            ownerId: httpRequest.user._id,
            createdOn: Date.now(),
            ip: ip,
            userAgent: userAgent
        };

        // Finally, after all checks, we return json on full model with meta data added to it            
        result.json = fullModelJson;
        result.isValid = true;
    }

    return result;
}



export function createFullModelAnon(json, fnFormModel, fnFormModelValidators, fnFullModel, httpRequest) {
    /*
    {   
        isValid: true if we can validate json
        json: json with metadata. This json will go into database
        errors: object with errors if validation fails        
    }
    */

    let result = {
        isValid: false,
        json: null,
        errors: null
    };


    // create form model from raw data
    let formModel = new fnFormModel(json);

    // save result of validating form model
    result.isValid = FormModelValidator.isModelValid(formModel, new fnFormModelValidators());
    
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
         
        delete fullModelJson.meta; // delete meta in case it exists
        delete fullModelJson._id; // if we don't delete _id, new record will be created with empty _id

        // get info about client
        let ip = '';
        let userAgent = '';
        if(httpRequest) {
            ip = httpRequest.headers['x-forwarded-for'] || httpRequest.connection.remoteAddress;
            userAgent = httpRequest.headers['user-agent'];
        }        
        fullModelJson.meta = {
            createdOn: Date.now(),
            ip: ip,
            userAgent: userAgent
        };
       
        // Finally, after all checks, we return json on full model with meta data added to it            
        result.json = fullModelJson;
        result.isValid = true;
    }

    return result;
}


export function createFormModel(json, fnFormModel, fnFormModelValidators) {
    /*
    {   
        isValid: true if we can validate json
        json: json with metadata. This json will go into database
        errors: object with errors if validation fails        
    }
    */

    let result = {
        isValid: false,
        json: null,
        errors: null
    };


    // create form model from raw data
    let formModel = new fnFormModel(json);

    // save result of validating form model
    result.isValid = FormModelValidator.isModelValid(formModel, new fnFormModelValidators());
    
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
        
        // Finally, after all checks, we return json on full model with meta data added to it            
        result.json = jsonFromFormModel;
        result.isValid = true;
    }
    return result;
}