// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

import * as _ from 'lodash';

// static catalog of books used for navigation in this example skill
const RAW_BOOKS = [
    {
        title: "The Shining",
        genre: "horror",
        author: "Stephen King",
        format: "physical",
        rating: 4,
        summary: "The Shining centers on the life of Jack Torrance, a struggling writer and recovering alcoholic who accepts a position as the off-season caretaker of the historic Overlook Hotel in the Colorado Rockies."
    },
    {
        title: "It",
        genre: "horror",
        author: "Stephen King",
        format: "physical",
        rating: 4,
        summary: "The story follows the experiences of seven children as they are terrorized by an evil entity that exploits the fears of its victims to disguise itself while hunting its prey."
    },
    {
        title: "Pet Sematary",
        genre: "horror",
        author: "Stephen King",
        format: "electronic reader",
        rating: 4,
        summary: " A family move in to their new home where they find a path leading to a 'Pet Sematary' in the woods where children from the past buried their pets."
    },
    {
        title: "The Green Mile",
        genre: "horror",
        author: "Stephen King",
        format: "audible",
        rating: 4,
        summary: "The story of death row supervisor Paul Edgecombe's encounter with John Coffey, an unusual inmate who displays inexplicable healing and empathetic abilities."
    },
    {
        title: "Under the Dome",
        genre: "science fiction",
        author: "Stephen King",
        format: "hardcover",
        rating: 4,
        summary: "A town is inexplicably and suddenly sealed off from the rest of the world by an invisible force field."
    },
    {
        title: "Doctor Sleep",
        genre: "horror",
        author: "Stephen King",
        format: "electronic reader",
        rating: 4,
        summary: "Sleep follows Danny Torrance, the troubled son of Shining protagonist Jack, as he gets drawn into a new battle against evil."
    },
    {
        title: "Four Past Midnight",
        genre: "horror",
        author: "Stephen King",
        format: "electronic reader",
        rating: 4,
        summary: "Ten strangers wake up aboard a red-eye flight from LA to Boston to discover themselves in an eerily empty world."
    },
    {
        title: "Do androids dream of robotic sheep?",
        genre: "science fiction",
        author: "Phillip K Dick",
        format: "electronic reader",
        rating: 4.5,
        summary: "It follows the story of Bounty Hunter Rick Deckard, whose job is to 'retire' renegade androids who have escaped from the outer colonies."
    },
    {
        title: "Dune",
        genre: "science fiction",
        author: "Frank Herbert",
        format: "audio",
        rating: 3,
        summary: "It tells the story of young Paul Atreides, whose family accepts the stewardship of the planet Arrakis."
    },
    {
        title: "A Game of Thrones",
        genre: "fantasy",
        author: "George R R Martin",
        format: "physical",
        rating: 3.5,
        summary: "The first in an epic series about a land in which the seasons shift between periods of seemingly endless summer and seemingly endless winter."
    },
    {
        title: "Pride and Prejudice",
        genre: "romance",
        author: "Jane Austen",
        format: "electronic reader",
        rating: 4,
        summary: "Pride and Prejudice follows the turbulent relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner. They must overcome the titular sins of pride and prejudice in order to fall in love and marry."
    },
    {
        title: "Hyperion",
        genre: "science fiction",
        author: "Dan Simmons",
        format: "audio",
        rating: 3,
        summary: "On the eve of Armageddon, with the entire galaxy at war, seven pilgrims set forth on a final voyage to Hyperion seeking the answers to the unsolved riddles of their lives."
    },
    {
        title: "Ready Player One",
        genre: "science fiction",
        author: "Ernest Cline",
        format: "physical",
        rating: 4,
        summary: "The story, set in a dystopia in 2045, follows protagonist Wade Watts on his search for an Easter egg in a worldwide virtual reality game, the discovery of which would lead him to inherit the game creator's fortune."
    },
    {
        title: "Harry Potter: Deathly Hallows",
        genre: "fantasy",
        author: "JK Rowling",
        format: "physical",
        rating: 4,
        summary: "The Deathly Hallows is about Harry Potter and his friends finding ways to destroy Voldemort."
    },
    {
        title: "The Fault in Our Stars",
        genre: "romance",
        author: "Hank Green",
        format: "physical",
        rating: 4,
        summary: "The Fault In Our Stars is a fabulous book about a young teenage girl who has been diagnosed with lung cancer and attends a cancer support group."
    },
    {
        title: "The Notebook",
        genre: "romance",
        author: "Nicholas Sparks",
        format: "audio",
        rating: 4,
        summary: " The story centers on the relationship between Noah Calhoun and Allie Nelson. Spanning over five decades, their love endures an uncertain beginning, the onset and conclusion of World War II, the death of one child, and Allie's eventual diagnosis of Alzheimer's disease."
    },
    {
        title: "The Hobbit",
        genre: "fantasy",
        author: "JRR Tolkien",
        format: "audio",
        rating: 4,
        summary: "The Hobbit is set within Tolkien's fictional universe and follows the quest of home-loving Bilbo Baggins, the titular hobbit, to win a share of the treasure guarded by a dragon named Smaug."
    }
];

// expand the raw books with an id field based on the index in raw books array, a name field based
// on the title (needed for default item name matcher to work) and a label field based on title and 
// author (required field to utilize the default presentPageResponse in the list nav component)
export const BOOKS : any = _.chain(_.range(0, RAW_BOOKS.length))
    .map((i) => ({
        ...RAW_BOOKS[i],
        id: i,
        name: RAW_BOOKS[i].title,
        label: `${RAW_BOOKS[i].title} by ${RAW_BOOKS[i].author}`
    }))
    .value();