## Customize inform rating event
By default the component allows the user to respond with simple utterances such as "3" or "my score is 3" to indicate their rating; to customize this "inform rating" event, simply define your own event and pass it into the [`informRatingEvent`](./REFERENCE.md#arguments) argument when calling the [`elicitRating`](./docs/REFERENCE.md#elicitrating) dialog in your ACDL code:

```
customInformRatingEvent = utterances<RatingRequest>([
    "{rating}",
    "I would give it a {rating}"
])

dialog Nothing Main {
    sample {
        ...

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult},

            //custom event
            informRatingEvent = customInformRatingEvent
        )
    }
}
```

For reference: [default inform rating event](../src/feedback.acdl#28-33)

## Customize rating validation
By default, if the user provides a invalid rating value (outside of 1-5 or other unknown utterance), the component will respond with a generic reponse to prompt for a different value; to customize this behavior: define your own invalid rating response and action (with custom validation), and pass the them into the [`saveRatingAction`](./REFERENCE.md#arguments) and [`requestRatingResponse`](./REFERENCE.md#arguments) arguments when calling the [`elicitRating`](./docs/REFERENCE.md#elicitrating) dialog in your ACDL code:

```
namespace my.skill

import prompts.customRequestRatingResponse

@validateArg(
  (rating >= 1 && rating <= 5) || (rating in ["one", "two", "three", "four","five"]), 
  customRequestRatingResponse, 
  customSaveRatingAction.arguments.rating)
action RatingRequest customSaveRatingAction(NUMBER rating)

dialog Nothing Main {
    sample {
        ...

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult},

            //custom action and response
            saveRatingAction = customSaveRatingAction,
            requestRatingResponse = customRequestRatingResponse
        )
    }
}
```

Also, make sure to give the custom action name to the [`SaveRatingRequestHandler`](./docs/REFERENCE.md#saveratingrequesthandler) in your API code:

```
export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        ...
        new SaveRatingRequestHandler("my.skill.customSaveRatingAction"),
    )
    .lambda();
```

For reference: [default invalid rating response](../response/prompts/invalidrating/document.json)

Also note that a [APLA document](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apla-interface.html) can be combined with a [APL document](https://developer.amazon.com/en-US/docs/alexa/alexa-design/apl.html) into a combined [MultiModelResponse](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-using-responses.html#create-apla-apl-files) and be passed into the component to customize both the audio and visual aspects of your skill:

```
import prompts.customRequestRatingPrompt
import displays.customRequestRatingScreen

customRequestRatingResponse = MultiModalResponse {
    apl = customSaveRatingScreen
    apla = customSaveRatingPrompt
}

dialog Nothing Main {
    sample {
        ...

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult},

            //custom response
            requestRatingResponse = customRequestRatingResponse
        )
    }
}
```

### Customize the save rating response
By default, once a user provides a rating value (and it has been saved), the component will respond with a simple "Thank You!" response; to customize this response, then simply define your own response and pass it into the [`notifySaveRatingResponse`](./REFERENCE.md#arguments) argument when calling the [`elicitRating`](./docs/REFERENCE.md#elicitrating) dialog in your ACDL code:

```
import prompts.customSaveRatingResponse

dialog Nothing Main {
    sample {
        ...

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult},

            //custom response
            notifySaveRatingResponse = customSaveRatingResponse
        )
    }
}
```

For reference: [default save rating response](../response/prompts/notifysaverating/document.json)

Also note that a [APLA document](https://developer.amazon.com/en-US/docs/alexa/alexa-presentation-language/apla-interface.html) can be combined with a [APL document](https://developer.amazon.com/en-US/docs/alexa/alexa-design/apl.html) into a combined [MultiModelResponse](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-using-responses.html#create-apla-apl-files) and be passed into the component to customize both the audio and visual aspects of your skill:

```
import prompts.customSaveRatingPrompt
import displays.customSaveRatingScreen

customSaveRatingResponse = MultiModalResponse {
    apl = customSaveRatingScreen
    apla = customSaveRatingPrompt
}

dialog Nothing Main {
    sample {
        ...

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult},

            //custom response
            notifySaveRatingResponse = customSaveRatingResponse
        )
    }
}
```

### Customize Rating Validation

```
// Weather.acdl
namespace examples.weatherbot

import com.amazon.alexa.skill.components.feedback_elicitation.*

type RatingRequest {
    NUMBER rating
}

@validateArg(rating >= 1 && rating <= 10, defInvRes, customSaveFeedbackAction.arguments.rating)
action RatingRequest customSaveFeedbackAction(NUMBER rating)

dialog Nothing Main {
    sample {
        ...
        weatherResult = getWeather(...)

        elicitRating(
            notifyResponse = weather_apla, 
            notifyAction = getWeather, 
            payload = ResponsePayload {weatherResult = weatherResult,
            //custom action
            saveRatingAction = customSaveFeedbackAction
            }
        )
    }
}
```

### Save ratings to custom database

By default, the provide request handler will simply save the rating to the standard console log (ending up in cloudwatch for AWS lambdas); but the skill dev can customize the handler to record the feedback wherever they would like, such as using the provided RedShift recorder to save the rating to a RedShift table for offline analysis

```
// index.ts
import { SaveRatingRequestHandler } from 
    '@alexa-skill-components/feedback-elicitation';
import { RedshiftClient } from '@aws-sdk/client-redshift';

...

redshiftClient = RedshiftClient(...)

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new SaveRatingRequestHandler(
            "com.amazon.alexa.skill.components.feedback_elicitation.defaultSaveFeedbackAction",
            new RedShiftRatingRecorder(redshiftClient, "myFeedbackTable"),
            true // Send false, IF you do not want to close the session.
        ),
    )
    .lambda();
```

### Gather rating without ending session

A boolean value that indicates what should happen after Alexa speaks the response

```
// index.ts
import { SaveRatingRequestHandler } from 
    '@alexa-skill-components/feedback-elicitation';

...

export const handler = SkillBuilders.custom()
    .addRequestHandlers(
        new SaveRatingRequestHandler(
            "com.amazon.alexa.skill.components.feedback_elicitation.defaultSaveFeedbackAction",
            (rating) => {
                console.log('This is implementation of the rating function, where the rating is ', rating)
            },
            true // Send false, IF you do not want to close the session.
        ),
    )
    .lambda();
```