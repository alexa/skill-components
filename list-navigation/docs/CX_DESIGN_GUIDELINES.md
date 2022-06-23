# Customer Experience Design Guidelines

## Design FAQs

### Q: Do the names of the options matter? Do I need to optimize them for voice?
A: Yes. To improve accuracy for the customer’s understanding (and Alexa’s), avoid list item names that are more than a few words long, rhyme, alliterate, or read like a tongue twister. Avoid naming list items with similar and shared terms. Names of items in a list should be verbally distinct. 

### Q: How many items should I include in a list"?
A: That depends on the number of items in your list, and how complex each item is. You may want to read out long, complex list items that have many elements one at a time, while you can read out up to 5 distinctive, one-word list items without confusing most listeners.

### Q: Do I need to read out ordinals for customers? (“The first one is …” or “Number 1 is …” or “A … B…”)
A: That depends on the kind of experience you’re creating. If the names of the list items may be difficult to hear as distinct options, must be long, complex, or include multiple components, you may want to include ordinals. With a preamble that specifies the number of items in a more simple list, ordinals may slow down the conversation. And of course, if you’re creating a quiz/trivia-stye experience, you’ll want to make it easy and accurate for a player to select their answer with ordinals. 

### Q: How should I prompt customers a second time to choose from a list after they reach an error? Should I repeat the whole list again?
A: That depends on the number of items and complexity of your list, and how complicated or important the decision may be for the customers. For complex scenarios, you may want to include more information about your list before repeating it in full, or, for simple scenarios, you may not need to repeat any of the items and a simplified re-prompt will do.


## Design Check List
Will your skill surface lists to your customer? If so, check your script to see if it’s easy for your customers to understand their options and make quick decisions.
- [ ] Lists include a preamble that informs the customer of context such as number of items in the list, conveys understanding of what the customer said, or states an assumption that was made.
- [ ] Lists surface options in order of contextual relevance wherever possible.
- [ ] The skill paginates long lists. It indicates the pagination to the customer in some way.
- [ ] The skill differentiates responses that include a list for devices with and without screens. 
- [ ] Labels for list items are verbally distinct
- [ ] There is a 350-400ms break between list items.
- [ ] A customer can browse paginated lists with common commands like  “next” “more” “go back” and “repeat.” 
- [ ] The skill allows customers to select options using ordinals. (“1, 2, 3” or “A, B, C …”)
- [ ] The skill prompts customers for their choice after reading their options.
- [ ] The skill allows customers to select options from a list using natural language, including synonyms and partial titles.
- [ ] The skill follows up to disambiguate if the customer makes a selection that could indicate more than one of the options.