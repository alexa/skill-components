export const testList = [
    {
        "genre": "horror",
        "author": "author name"
    },
    {
        "genre": "comedy",
        "author": "author name2"
    },
    {
        "genre": "horror",
        "author": "author name3"
    }
]

export const sessionActiveCatalog = {
    "id": "6c84fb90-12c4-11e1-840d-7b25c5ee775a",
    "catalogProviderName": "ac.FixedCatalogCursor",
    "pageSize": 2

}

export const validSearchConditions = {
    "genre": "horror"
}

export const validPropertyResult = {
    value: "horror"
}

export const sessionProviderState = {
    "6c84fb90-12c4-11e1-840d-7b25c5ee775a": {
        "list": [
            {
                "genre": "horror",
                "author": "author name"
            },
            {
                "genre": "comedy",
                "author": "author name2"
            },
            {
                "genre": "horror",
                "author": "author name3"
            }
        ],
        "seenList": [],
        "prevPageLength": 0
    }
}

export const emptySearchConditions = {}

export const sessionRecommendationResult = {
    "rescoped": false,
    "searchConditions": {},
    "recommendations": {
        "items": [
            {
                "genre": "horror",
                "author": "author name"
            }
        ],
        "itemCount": 1,
    }
}

export const sessionRecommendationResultMultiItems = {
    "rescoped": false,
    "searchConditions": {},
    "recommendations": {
        "items": [
            {
                "genre": "horror",
                "author": "author name"
            },
            {
                "genre": "comedy",
                "author": "author name2"
            },
            {
                "genre": "horror",
                "author": "author name3"
            }
        ],
        "itemCount": 3,
    }
}

export const itemOne = {
    "author": "author name",
    "genre": "horror"
}

export const itemTwo = {
    "author": "author name2",
    "genre": "comedy"
}

export const itemThree = {
    "author": "author name3",
    "genre": "horror"
}

export const testSeenList = [
    itemOne,
    itemTwo,
    itemOne,
    itemTwo,
    itemOne,
    itemThree,
    itemOne
]

export const searchAttribute = "genre"

export const searchAttributeValueMatching = "horror"

export const searchAttributeValueNotMatching = "romantic"

export const validActionName = "book"

export const pageSize = 2