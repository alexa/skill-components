# Overview
Skill Components are pre-built voice interactions that let you build exciting new functionality into your Alexa skills quickly and easily. These ready-to-use voice experiences are constructed according to best practices and designed accommodate a multitude of possible user interaction paths. When you import Skill Components into your existing voice models, you can spend less time writing code and more time creating unique features for your skill. 

Five Skill Components are available: List Navigation, Catalog Search & Refine, Feedback Elicitation, Account Linking, and In-Skill Purchasing. This document focuses on the Feedback Elicitation Skill Component, a mechanism for gathering user ratings.


# ACDL Reusable Dialogs
In the Alexa Conversations Description Language (ACDL), you can write reusable dialogs with predefined turns to carry out common tasks. Reusable dialogs enable you to invoke other dialogs by using a syntax similar to function calls. With reusable dialogs, you can write succinct, hierarchical dialogs instead of multiple flattened dialogs.

## Table of Contents
- [Overview](#overview)
- [ACDL Reusable Dialogs](#acdl-reusable-dialogs)
  - [Table of Contents](#table-of-contents)
  - [elicitRating](#elicitrating)
    - [Limitations](#limitations)
    - [Arguments](#arguments)
    - [Return Value](#return-value)
    - [Validation](#validation)
- [API Handlers](#api-handlers)
  - [SaveRatingRequestHandler](#saveratingrequesthandler)
    - [Constructor Arguments](#constructor-arguments)
    - [Rating Recorder](#rating-recorder)
    - [shouldEndSession](#shouldendsession)
    - [validateArg annotation](#validatearg-annotation)

## elicitRating

Dialog to present a result to a user and elicit a (numeric) rating from the user in a single response.

### Limitations

* The reusable dialogs's flow starts with a `response()`, thus a API call should proceed a call to the reusable dialog.
* The reusable dialog's flow ends in a `response()`, thus the next valid dialog flow statement should be a `expect()` (if the dialog sample does not end in a call to this reusable dialog). Placing another `response()` call after a call to the reusable dialog will result in the response being ignored; other dialog flow statements may result in compiler or build-time errors.

### Arguments
* `Response notifyResponse` (required)
  * Response template to use to notify the user of a result and elicit feedback from them
* `Action notifyAction` (required)
  * Action that produced the result being presented to the user, will not be invoked
* `Thing payload` (required)
  * Result payload to pass into the "notifyResponse" template
* `Event<RatingRequest> informRatingEvent`
  * Event for user to provide their rating
  * Defaults to a built-in set of spoken utterances (`defaultInformRatingEvent`) including "my score is {rating}" and simply "{rating}"
* `Response requestRatingResponse`
  * Response template used when user gives a rating that could not be understood
  * Defaults to built-in response (`defaultInvalidResponse`) requesting the user provide a valid rating
* `Action1<Number, Nothing> saveRatingAction`
  * Action that is called when a user provides a rating value
  * One input argument for the rating value provided by the user
  * No return value
  * Defaults to a action bundled with the component (`defaultSaveRatingAction`)
* `Response notifySaveRatingResponse`
  * Response template used after a rating value has been provided by the user and saved
  * Defaults to simple built-in response (`defaultSaveResponse`) thanking the user for providing thr feedback

|     | Name                     | Type         | Description                                                                      |
|:--  |:----------------         | :-----:      |:------------------------------------------------------------------               |
| 1   | notifyResponse           | Response     | The APLA response prompt to be used for requesting feedback                      |
| 2   | payload                  | Thing        | Response payload of the previous action called                                   |
| 3   | notifyAction             | Action       | Action that produced the result being presented to the user, will not be invoked |
| 4   | informRatingEvent        | Event        | Event for user to provide their rating. Defaults to a built-in set of spoken utterances (`defaultInformRatingEvent`) including "my score is {rating}" and simply "{rating}" |
| 5   | requestRatingResponse    | Response     | Response template used when user gives a rating that could not be understood. Defaults to built-in response (`defaultInvalidResponse`) requesting the user provide a valid rating, (`payload`) = "The given rating was invalid. Please give this interaction a rating between 1-5, where 5 is the highest rating" |
| 6   | saveRatingAction         | Action1      | Action that is called when a user provides a rating value. One input argument for the rating value provided by the user. No return value. Defaults to a action bundled with the component(`defaultSaveRatingAction`)          |
| 7   | notifySaveRatingResponse | Response     | Response template used after a rating value has been provided by the user and saved. Defaults to simple built-in response (`defaultSaveResponse`) thanking the user for providing thr feedback, (`payload`) = "Thank you for the feedback! ${payload.ratingResult.rating >= 4 ? 'Glad that you enjoyed the experience' : (payload.ratingResult.rating <= 3 ? 'All right! We will continue to improve' : 'Sorry about that. We will fix the concern soon!')}"          |

### Return Value

Reusable dialog returns nothing

### Validation

See [Customize rating validation](./RECIPES.md#customize-rating-validation) recipe for how to customize the validation on the rating value provided by the customer.

# API Handlers

## SaveRatingRequestHandler

Can be used to handle requests to the action specified by the `saveRatingAction` argument to the `elicitRating` reusable dialog.

### Constructor Arguments

* apiName : string
  * (Fully qualified) name of the ACDL action this handler is meant to handle requests for
  * Defaults to bundled name of the bundled `defaultSaveFeedbackAction` action
* ratingRecorder : RatingRecorder
  * Implementation of `RatingRecorder` interface to call when the user provides a rating
  * Defaults to bundled `LogRatingRecorder`; see section below on 

### Rating Recorder

The default `LogRatingRecorder` simply records the rating to the console log (ended in in cloudwatch if AWS Lambda is used for a skill endpoint). 

To specify a custom recorder, create a custom implementation of the `RatingRecorder` interface and pass a instance into the request handler:
```
class CustomRatingRecorder : RatingRecorder {
	handleRating(rating : Number): void {
		...
	}
}

new SaveRatingRequestHandler(ratingRecorder = new CustomRatingRecorder())
```
### shouldEndSession

The shouldEndSession is a boolean value that indicates what should happen after Alexa speaks the response
* true: The session ends.
* false or null: Alexa opens the microphone for a few seconds to listen for the user's response. Include a reprompt to give the user a second chance to respond.
Note: Alexa speaks the reprompt when shouldEndSession is false and the user doesn't respond within a few seconds

### validateArg annotation

validate the value for the action argument as per developer-defined criteria and automatically re-prompt users who provide an invalid value for the action argument

 * condition : A boolean expression based on action arguments and static expressions. The boolean expression must reference at least one action argument.
 * requestPrompt : The prompt to request the new value for invalid arguments.
 * arguments : Action arguments for which new values need to be requested.

@annotation(targets = [AnnotationTarget.Action], allowMultiple = true)
action void validateArg(Boolean condition, Response requestPrompt, Args<Argument> arguments)

example: @validateArg((rating >= 1 && rating <= 5) || (rating in ["one", "two", "three", "four","five"]) )



