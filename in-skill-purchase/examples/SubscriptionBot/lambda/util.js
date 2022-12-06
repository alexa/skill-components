const Alexa = require('ask-sdk-core');
const _ = require('lodash');

const getAPIName = (handlerInput) => {
    return handlerInput.requestEnvelope.request.apiRequest.name;
};
module.exports.getAPIName = getAPIName;

/**
 * Helper method to find if a request is a API request, optionally for a specific API
 */
module.exports.isApiRequest = (handlerInput, apiName) => {
    const isApiRequest = Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked';

    if (apiName) {
        return isApiRequest && getAPIName(handlerInput) === apiName;
    } else {
        return isApiRequest;
    }
};
module.exports.isApiRequestPrefix = (handlerInput, apiName) => {
    const isApiRequest = Alexa.getRequestType(handlerInput.requestEnvelope) === 'Dialog.API.Invoked';

    return isApiRequest && getAPIName(handlerInput).startsWith(apiName);
};

/**
 * Helper method to get API request entity from the request envelope.
 */
module.exports.getApiArguments = (handlerInput) => {
    return handlerInput.requestEnvelope.request.apiRequest.arguments || {};
};

/**
 * Helper method to get API resolved entity from the request envelope.
 */
const getApiSlots = (handlerInput) => {
    return handlerInput.requestEnvelope.request.apiRequest.slots || {};
};
module.exports.getApiSlots = getApiSlots;

const getSlotResolvedValue = (slot) => {
    const firstAuthority = _.first(_.get(slot, 'resolutions.resolutionsPerAuthority'));
    const firstAuthorityValue = _.first(_.get(firstAuthority, 'values'));
    return _.get(firstAuthorityValue, 'value.name');
};
module.exports.getSlotResolvedValue = getSlotResolvedValue;

module.exports.getResolvedApiSlotValues = (handlerInput) => {
    const slots = getApiSlots(handlerInput);

    let resolvedSlotValues = {};
    for(let slotName of Object.keys(slots)){
        resolvedSlotValues[slotName] = getSlotResolvedValue(slots[slotName]);
    }
    return resolvedSlotValues;
};


const getSlotResolvedId = (slot) => {
    const firstAuthority = _.first(_.get(slot, 'resolutions.resolutionsPerAuthority'));
    const firstAuthorityValue = _.first(_.get(firstAuthority, 'values'));
    return _.get(firstAuthorityValue, 'value.id');
};
module.exports.getSlotResolvedId = getSlotResolvedId;

module.exports.getResolvedApiSlotIds = (handlerInput) => {
    const slots = getApiSlots(handlerInput);

    let resolvedSlotIds = {};
    for(let slotName of Object.keys(slots)){
        resolvedSlotIds[slotName] = getSlotResolvedId(slots[slotName]);
    }
    return resolvedSlotIds;
};
