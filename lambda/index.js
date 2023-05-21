/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const GIVEN_NAME_PERMISSION = ['alexa::profile:given_name:read'];

var persistenceAdapter = getPersistenceAdapter();


// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const axios = require('axios');
const languageStrings = require('./languageStrings');


// TMDB 

const key = '175d366b7fbce5a3086b8cbd6592ed99';


// CODE 

// TMBD IDs

function searchPersonID(person) {
    console.log(`Finding personID for ${person}`);
    return new Promise(async (resolve, reject) => {
        let url = `https://api.themoviedb.org/3/search/person?api_key=${key}&query=${person}`;
        try {
            var { data } = await axios.get(url);
        } catch (error) {
            console.log(error)
            reject(error)
        }

        if (data.total_results > 0) {
            let personID = data.results[0].id; // Select the most popular result
            console.log(`The personID for ${person} is ${personID}`);
            resolve(personID);
        }
        else { resolve(null); }
    })
}


function searchMovie(people) {
    return new Promise(async (resolve, reject) => {
        // If actors or directors are present, find their ID and update the request URL
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=es-ES&sort_by=popularity.desc&include_adult=true`;

        if (people) {
            // Search for the actors ID in parallel.
            let promises = people.map((person) => {
                console.log(`searching ID for: ${person}`);
                return searchPersonID(person);
            });

            let personsID = await Promise.all(promises);
            console.log(personsID);
            
            url = url + `&with_people=${personsID.join()}`;
        }

        try {
            var { data } = await axios.get(url);
        } catch (error) {
            console.log(error);
            reject(error);
        }

        if (data.total_results > 0) {
            console.log(data.results);
            //return data.results.map((movie) => { return movie.title }).join();
            // Choose a random movie from the results
            let random = Math.floor(Math.random() * data.results.length);
            let movie = data.results[random].title;
            resolve(movie);
        } else {
            resolve(null);
        }
    });
}


function searchMovieGenre(genero) {
    return new Promise(async (resolve, reject) => {
        // If actors or directors are present, find their ID and update the request URL
        let url = `https://api.themoviedb.org/3/discover/movie?api_key=${key}&language=es-ES&sort_by=popularity.desc&include_adult=true`;
            
        url = url + `&with_genres=${genero}`;

        try {
            var { data } = await axios.get(url);
        } catch (error) {
            console.log(error);
            reject(error);
        }

        if (data.total_results > 0) {
            console.log(data.results);
            //return data.results.map((movie) => { return movie.title }).join();
            // Choose a random movie from the results
            let random = Math.floor(Math.random() * data.results.length);
            let movie = data.results[random].title;
            resolve(movie);
        } else {
            resolve(null);
        }
    });
}



// handler movie recommender

const RecomendacionIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecomendacionIntent';
  },
  async handle(handlerInput) {

    let actor = handlerInput.requestEnvelope.request.intent.slots.NombreActor.value;
    let director = handlerInput.requestEnvelope.request.intent.slots.NombreDirector.value;

    // People use the same API, group them.
    var people = [];
    if (actor) { people.push(actor) }
    if (director) { people.push(director) }
    
    
    var speakOutput = ''; 

   let movie = await searchMovie(people);
    if (movie) {
      speakOutput =  handlerInput.t('RECOMENDACION_MSG_ONE') + movie;
    } else {
      speakOutput = handlerInput.t('PRUEBA_OTRO_NOMBRE_MSG');
    } 
    
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};

const RecomendarActorFavoritoHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecomendarActorFavorito';
  },
    async handle(handlerInput) {
        
    const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let actor = sessionAttributes['actor'];
    
    // People use the same API, group them.
    var people = [];
    if (actor) { people.push(actor) }
    
    var speakOutput = ''; 
    let movie = await searchMovie(people);
    
    if (movie) {
      speakOutput = handlerInput.t('RECOMENDACION_MSG_TWO') + movie;
    } else {
      speakOutput = handlerInput.t('PRUEBA_OTRO_NOMBRE_MSG');
    }
    
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};

const RecomendarDirectorFavoritoHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecomendarDirectorFavorito';
  },
    async handle(handlerInput) {
        
    const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let director = sessionAttributes['director'];
    
    // People use the same API, group them.
    var people = [];
    if (director) { people.push(director) }
    
    var speakOutput = ''; 
    let movie = await searchMovie(people);
    
    if (movie) {
      speakOutput = handlerInput.t('RECOMENDACION_MSG_THREE') + movie + handlerInput.t('DEL_DIRECTOR_MSG') + director;
    } else {
      speakOutput = handlerInput.t('PRUEBA_OTRO_NOMBRE_MSG');
    }
    
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};

const RecomendarGeneroFavoritoHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecomendarGeneroFavorito';
  },
    async handle(handlerInput) {
        
    const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
    const requestAttributes = attributesManager.getRequestAttributes();
    const sessionAttributes = attributesManager.getSessionAttributes();

    let genero = sessionAttributes['genero'];
    
    
    var speakOutput = ''; 
    let movie = await searchMovieGenre(genero);
    
    if (movie) {
      speakOutput = handlerInput.t('RECOMENDACION_MSG_FOUR') + movie + handlerInput.t('DEL_GENERO_MSG') + genero;
    } else {
      speakOutput = handlerInput.t('PRUEBA_OTRO_NOMBRE_MSG');
    }
    
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};

const RecomendacionAleatoriaGeneroHandler = {
    canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'RecomendacionAleatoriaGenero';
  },
    async handle(handlerInput) {
        
    let genero = handlerInput.requestEnvelope.request.intent.slots.GeneroElegido.value;
    
    var speakOutput = ''; 
    let movie = await searchMovieGenre(genero);
    
    if (movie) {
      speakOutput = handlerInput.t('RECOMENDACION_MSG_TWO') + movie + handlerInput.t('DEL_GENERO_MSG') + genero;
    } else {
      speakOutput = handlerInput.t('PRUEBA_OTRO_NOMBRE_MSG');
    }
    
    return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
  }
};


function getPersistenceAdapter(tableName) {
    // This function is an indirect way to detect if this is part of an Alexa-Hosted skill
    function isAlexaHosted() {
        return process.env.S3_PERSISTENCE_BUCKET;
    }
    if (isAlexaHosted()) {
        const {S3PersistenceAdapter} = require('ask-sdk-s3-persistence-adapter');
        return new S3PersistenceAdapter({
            bucketName: process.env.S3_PERSISTENCE_BUCKET
        });
    } else {
        // IMPORTANT: don't forget to give DynamoDB access to the role you're using to run this lambda (via IAM policy)
        const {DynamoDbPersistenceAdapter} = require('ask-sdk-dynamodb-persistence-adapter');
        return new DynamoDbPersistenceAdapter({
            tableName: tableName || 'recomendaciones',
            createTable: true
        });
    }
}

// If you disable the skill and reenable it the userId might change and the user will have to grant the permission to access the name again
const LoadNameRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        if (!sessionAttributes['name']){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable this permission in your skill configuratiuon (Build tab -> Permissions)
            // or you'll get a SessionEndedRequest with an ERROR of type INVALID_RESPONSE
            // Per our policies you can't make personal data persistent so we limit "name" to session attributes
            try {
                const {permissions} = requestEnvelope.context.System.user;
                if (!(permissions && permissions.consentToken))
                    throw { statusCode: 401, message: 'No permissions available' }; // there are zero permissions, no point in intializing the API
                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileName();  
                if (profileName) { // the user might not have set the name
                    //save to session attributes
                    sessionAttributes['name'] = profileName;
                }
            } catch (error) {
                console.log(JSON.stringify(error));
                if (error.statusCode === 401 || error.statusCode === 403) {
                    // the user needs to enable the permissions for given name, let's append a permissions card to the response.
                    handlerInput.responseBuilder.withAskForPermissionsConsentCard(GIVEN_NAME_PERMISSION);
                }
            }
        }
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
   async handle(handlerInput) {
        const {attributesManager, serviceClientFactory, requestEnvelope} = handlerInput;
        const requestAttributes = attributesManager.getRequestAttributes();
        const sessionAttributes = attributesManager.getSessionAttributes();

        const actor = sessionAttributes['actor'];
        const director = sessionAttributes['director'];
        const genero = sessionAttributes['genero'];
        const name = sessionAttributes['name'] ? sessionAttributes['name'] : '';//sessionAttributes['name'] || '';

        const datosguardados = actor && director && genero;
        

if(!name){
            // let's try to get the given name via the Customer Profile API
            // don't forget to enable the Given Name permission in your skill configuration (Build tab -> Permissions)
            try {

                const upsServiceClient = serviceClientFactory.getUpsServiceClient();
                const profileName = await upsServiceClient.getProfileGivenName();
                if (profileName) { // the user might not have set the name
                  //save to session and persisten attributes
                  sessionAttributes['name'] = profileName;
                }

            } catch (error) {
                if (error.statusCode === 403) {
                    // the user has to enable the permissions for given name, let's send a silent permissions card
                  handlerInput.responseBuilder.withAskForPermissionsConsentCard(GIVEN_NAME_PERMISSION);
                }
            }
        } 
        
        let speakOutput = handlerInput.t('WELCOME_MSG', {name: name}) + ' ' + handlerInput.t('HELP_MSG');
            if (datosguardados){
                // we can't use intent chaining because the target intent is not dialog based
                 speakOutput = handlerInput.t('REGISTER_MSG_TWO', {name: name, actor: actor, genero: genero, director: director});
            }  
              
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const RegistrarDatosIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RegistrarDatosIntent';
    },
    handle(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const {intent} = requestEnvelope.request;

        const actor = intent.slots.actorslot.value;
        const director = intent.slots.directorslot.value;
        const genero = intent.slots.genreslot.value; 
        
        sessionAttributes['actor'] = actor;
        sessionAttributes['director'] = director;
        sessionAttributes['genero'] = genero;

        const speakOutput = handlerInput.t('REGISTER_MSG', {actor: actor, genero: genero, director: director}) + handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(handlerInput.t('HELP_MSG'))
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intentName: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};

/* *
 * Below we use async and await ( more info: javascript.info/async-await )
 * It's a way to wrap promises and waait for the result of an external async operation
 * Like getting and saving the persistent attributes
 * */
const LoadAttributesRequestInterceptor = {
    async process(handlerInput) {
        const {attributesManager, requestEnvelope} = handlerInput;
        if (Alexa.isNewSession(requestEnvelope)){ //is this a new session? this check is not enough if using auto-delegate (more on next module)
            const persistentAttributes = await attributesManager.getPersistentAttributes() || {};
            console.log('Loading from persistent storage: ' + JSON.stringify(persistentAttributes));
            //copy persistent attribute to session attributes
            attributesManager.setSessionAttributes(persistentAttributes); // ALL persistent attributtes are now session attributes
        }
    }
};

// If you disable the skill and reenable it the userId might change and you loose the persistent attributes saved below as userId is the primary key
const SaveAttributesResponseInterceptor = {
    async process(handlerInput, response) {
        if (!response) return; // avoid intercepting calls that have no outgoing response due to errors
        const {attributesManager, requestEnvelope} = handlerInput;
        const sessionAttributes = attributesManager.getSessionAttributes();
        const shouldEndSession = (typeof response.shouldEndSession === "undefined" ? true : response.shouldEndSession); //is this a session end?
        if (shouldEndSession || Alexa.getRequestType(requestEnvelope) === 'SessionEndedRequest') { // skill was stopped or timed out
            // we increment a persistent session counter here
            sessionAttributes['sessionCounter'] = sessionAttributes['sessionCounter'] ? sessionAttributes['sessionCounter'] + 1 : 1;
            // we make ALL session attributes persistent
            console.log('Saving to persistent storage:' + JSON.stringify(sessionAttributes));
            attributesManager.setPersistentAttributes(sessionAttributes);
            await attributesManager.savePersistentAttributes();
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        RegistrarDatosIntentHandler,
        RecomendarActorFavoritoHandler,
        RecomendacionIntentHandler,
        RecomendarDirectorFavoritoHandler,
        RecomendacionAleatoriaGeneroHandler,
        RecomendarGeneroFavoritoHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalisationRequestInterceptor,
        LoggingRequestInterceptor,
        LoadAttributesRequestInterceptor,
        LoadNameRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor,
        SaveAttributesResponseInterceptor)
    .withPersistenceAdapter(persistenceAdapter)
    .withApiClient(new Alexa.DefaultApiClient())
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();