# Standardization Specification | Skill-Components

## Introduction

These guidelines are captured to provide a consistent developer experience across skill-components. Components that match the existing conventions help in satisfying the common developer expectations.


## A. Packaging & Directory Structure

Use the `hyphen-case` style for the component name. As it will be placed inside the [skill-components directory](https://github.com/alexa/skill-components), avoid using suffixes or prefixes like *`skill-component`*, *`rc`*, etc. However, the title, caption, or description in the documentation may use a suffix *`Skill Component`* for clarity.


### 1. NPM Packages

Individual skill-component NPM packages offered by Amazon are kept under `@alexa-skill-components` org. The packages are named as `@alexa-skill-components/<component-name>`. This scheme can be followed to organise skill-components. Consider [@alexa-skill-components/list-navigation](https://www.npmjs.com/package/@alexa-skill-components/list-navigation) as an example.


### 2. GitHub Repositories

Skill-components by Amazon are placed in the [`skill-components` directory on GitHub](https://github.com/alexa/skill-components). Consider [skill-components/list-navigation](https://github.com/alexa/skill-components/tree/main/list-navigation) as an example.


### 3. ACDL Namespace

Skill-Components by Amazon are placed under the namespace `com.amazon.alexa.skill.components`. ACDL namespace should use the `snake_case` style. Consider these examples-

* `com.amazon.alexa.skill.components.feedback_elictation`
* `com.amazon.alexa.skill.components.list_navigation`


### 4. Attributes for package.json

* Publisher and Author should be assigned with an appropriate value. For example, [these components](https://github.com/alexa/skill-components) have [publisher](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/package.json#L4) set to ‘Amazon’. Similarly, 3P developers should set an appropriate value for publisher.
* Include the repository configuration containing `type`, `url` and `directory` attributes. Consider [this example](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/package.json#L8). 
* Ensure that the source directories are marked against [`ask` key](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/package.json#L57). Otherwise, the ACDL won’t be consumable.
* Include all relevant build scripts. It should have clean, compile, test, and build commands. [Scripts for feedback-elicitation](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/package.json#L20) is an example.
* Follow [versioning and tagging guidelines by npmjs](https://docs.npmjs.com/about-semantic-versioning) that explain the involved version fragments and their significance. Start at 0.0.1 for private preview versions and at 1.0.0 for public releases.



## B. READMEs & References

### 1. README

Make sure that component’s README has step-by-step setup and configuration instructions. This should help a skill-developer to get onboarded quickly. It should also have example skill documentation, recipes, and references to additional resources. Getting started and setup pages should describe prerequisites and config expectations. Consider the following template and [feedback-elicitation README](https://github.com/alexa/skill-components/tree/main/feedback-elicitation) as an example.

```
    Introduction
        Prerequisites
        When should I use this component?
        Example Interaction
    Usage
        Familiarize yourself with Alexa Skill Components
        Install the component in your Skill
        Call reusable dialog
        Setup API Handlers
        Compile and deploy your Skill
        Test your Skill
        Iterate
    Recipes [Optional]
    References & License
    Example Skills
    Risks & Potential Conflicts [Optional]
    Known Issues [Optional]
    Contribution [Include contribution guidelines and issue tracker information]
```


### 2. References & License

Skill-Component’s README should include a `Recipes` section to describe how the dialogs, events, and responses should be used or customized. It should include code-fragments as it helps a skill-developer to start consuming the component. It should also describe scenarios and use-cases that are addressed with the component’s features. Check these [Recipes for feedback-elicitation](https://github.com/alexa/skill-components/blob/main/feedback-elicitation/docs/RECIPES.md).
Skill-Component developer should include references to information on processes for consuming and publishing the component.
Every component should include its LICENSE file.


### 3. Example Skills

Example skills help developer in understanding the intended way of using the skill-component. It shows component’s capabilities and offerings. A set of small, well-described sample skills improve the component’s user adoption. Check these [examples with feedback-elicitation](https://github.com/alexa/skill-components/tree/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/examples).


## C. Developer Experience

These are the Developer Experience (DX) Guidelines to improve skill-component discoverability & readability. These are specific to writing and organising skill-component and ACDL code.

1. **Built-in Types**: Most of the common types are already defined in `com.amazon.ask.types.builtins.AMAZON`. Consider using these whenever possible.


2. **Dialogs**: Dialog names should follow an action verb format that describes user behavior being modelled. `ensureAccountLinked`, `navigateList`, `elicitFeedback` are some of the examples.

   Top-level dialogs and types should be at the base of component namespace, but other internal dialogs or more specific types can be under a sub-namespace for better organization.


3. **Acts:** Use event types like `Invoke`, `Affirm`, `Inform,` etc depending upon the use case. This increases the model accuracy as model knows what to predict from the user. Refer to [Acts documentation](https://developer.amazon.com/en-US/docs/alexa/conversations/acdl-request-acts.html) for the available types to understand what should be used in a particular scenario.


4. **Request & Response Types**: Consider defining component-specific request and response types. Use the suffix `Request` or  `Response`. For example, consider [response declarations](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/in-skill-purchase/src/resume.acdl#L27) for a dialog.

   While providing users the option to customize the response of a dialog, accept it as the type `Response` rather than concrete `APL` or `APLA` types, so that the user can provide any of these. This [example](https://code.amazon.com/packages/AccountLinkingReusableComponent/blobs/c6d25b955f80f471de668067a1e7ed01688718c4/--/src/account_linking_required_rd.acdl#L24) expects `Response` type as the parameter of the reusable dialog.

   Component should return a value that the skill-developer can use to continue the conversation when component passes control to the skill. Skill developers may ignore the returned value if they want. Component’s documentation should specify how these return values can be used and what can follow the component’s invocation. For example, consider [this section on the list-navigation’s navigateList dialog](https://github.com/alexa/skill-components/blob/main/list-navigation/docs/REFERENCE.md#limitations).
   The expectations stated in the above example are that an event or API call must proceed this dialog’s invocation, and an API call or response must follow a call to this dialog.



5. **Language & Locale**: Language support should be controlled by `@locale` annotations on the utterance sets, responses, dialogs, and samples. [This page in the ACDL documentation](https://developer.amazon.com/pt-BR/docs/alexa/conversations/acdl-support-multiple-locales.html) explains how to support multiple locales.
   If these are defined by skill developer and passed into component, then component will work with the skill-developer specified locale. Otherwise, it will work with locale defined on the default utterance sets.


6. **Privacy & Security:** Provide information on privacy and security considerations. This includes recorded data, activity, settings, preferences, etc. For example, if the skill components log telemetry or "call home" it should be called out, and options to turn them off should be included.


7. **Request Handlers:** The request handlers of the component should be placed inside the lambda folder at the root of component directory. It is recommended to group handlers, providers and recorders into their own folders. API model should be described using static methods on a class named after the component, as specified [here](https://github.com/alexa/skill-components/blob/main/list-navigation/lambda/interface.ts#L40). All handlers should have a block-comment describing its operation, required parameters and return types, if applicable.
    ```
       ├── handlers
       │ ├── handler.ts
       ├── providers
       │ ├── provider.ts
       │ ...
       ├── helpers
       │ ├── database-helper.ts
       │ ...
       ├── index.ts
       ├── util.ts
       ├── interfaces.ts
       ...
    ```

   The skill-component should offer a single method to create all the required handlers. For example- [createHandlers method in list-navigation](https://github.com/alexa/skill-components/blob/55f16075f924ab9ab7412f72fc726f08ae1b014c/list-navigation/lambda/interface.ts#L110).


8. **Error Handlers & Fallback Utterances**: In case an exception occurs while executing an API request handler, the error handler is executed. As a result, the error is propagated back to the skill so that the skill-developer can handle it. Consider [this example](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/examples/FlightBot/lambda/index.js#L123). It is recommended to have an exception-handled lambda specification when developing a skill.
   Skill developer should also specify fallback intent, as specified [here](https://github.com/alexa/skill-components/blob/05b005ccba7699933063ba65595b3d443d1d5483/feedback-elicitation/examples/FlightBot/skill-package/interactionModels/custom/en-US.json#L19). Fallback intent takes effect when none of the other utterances match the request.

   If there are known errors that can occur with a skill-developer's usage of a component, then a component should expose an error callback so that the skill-developer can handle it and provide a custom error response to the user.



## D. Language Conventions

These norms apply to both ACDL and Typescript based code. It becomes easy to read and maintain the code if it uses widely adopted conventions.

### 1. Language Constructs

Ensure that you follow the programming language conventions and use appropriate keywords and constructs. Following language-specific conventions improves the developer experience.

* **Classes and types** represent entities. These are generally represented by `PascalCase` nouns.
    

* **Interfaces** define a rule of behaviour that can be implemented by any class or type. Interfaces are generally represented by adjectives like *ResponseListener*, *Runnable*, etc. 
    

* **Methods** are actions that are generally *`camelCase`* or *`snake_case`* verbs.

    
* **Identifiers** are other language constructs like packages, constants, and variables. Identifiers and tokens should reveal intention and improve readability. For instance, *`fileName`* is a better identifier than *`fn`*.



### 2. Naming & labelling

Descriptive names should be used to reveal the context-specific purpose.

* **Common Concepts**: Consider using established relevant concepts and patterns to name visible attributes and entities. For example, to specify a paginated view of items, use `Page<Item>` instead of `Set<Item>` or `Group<Item>`.

    For well-known abbreviations among developers, they should be used for better readability. `config`, `stats`, `id`, etc. are some of the well-known abbreviations. The help-guides and READMEs should still use the actual names.
    
    
* **Attribute Names**: Make sure that attribute names precise, intention-revealing and concise. We should avoid using prepositions. For example, use:
    * `failure_cause` instead of `cause_of_failure`
    * `failure_time_memory` instead of `memory_at_time_of_failure` 
    * `imported_documents` instead of `documents_imported` 
            
        Currently, ACDL identifiers have to use short names because of a 64-char length restriction on identifiers. Due to this restriction, attribute `devSavRes` is used instead of `defaultSaveResult` in the following example-
        `com.amazon.alexa.skill.components.feedback_elicitation.defSavRes` 

            
* **Method Names**: Make sure that methods across interfaces are denoted by a common verb. For example, *getScore*, *fetchScore, and* *retrieveScore* imply the same thing. Using only one of them across interfaces improves the developer experience.
    Method names  *`calculateScore`* and *`getScore`* reveal how they are different.

        
* **Quantities**: Consider including the unit of measure in identifiers to keep it close towards the exact use-case. Some of the examples are: `distance_meters`, `delay_seconds`. If the quantity represents the number of items, use `device_count` instead of `devices`.



### 3. API Documentation

All handlers, dialogs, types, and methods that interact with a skill should have a block-comment to describe its operation, required parameters and return types. It helps readers establish the procedural context and/or purpose of the code fragment. Comments should also include references to tracked issues, bugs, and fixes, if any.

Every file should have the license header at the top.
