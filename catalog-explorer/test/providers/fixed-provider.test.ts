import { PagingDirection } from "../../lambda/catalog-provider"
import { FixedProvider } from "../../lambda/providers/fixed-provider"
import {
    testList,
    validSearchConditions,
    validPropertyResult,
    emptySearchConditions,
    itemOne,
    pageSize,
    itemTwo,
    itemThree,
    searchAttribute,
    searchAttributeValueMatching,
    searchAttributeValueNotMatching,
    validActionName,
    testSeenList
} from '../resources/test-common';

const page = {
    "itemCount": 2,
    "items": [
        itemOne,
        itemThree
    ],
    "nextPageToken": undefined,
    "prevPageToken": undefined
}

const selectItemPage = {
    "itemCount": 1,
    "items": [
        itemOne
    ],
    "nextPageToken": undefined,
    "prevPageToken": undefined
}

const recommendationResult = {
    "recommendations": page,
    "rescoped": false,
    "searchConditions": validSearchConditions
}

const selectItemRecommendationResult = {
    "recommendations": selectItemPage,
    "rescoped": false,
    "searchConditions": {}
}

const fixedProviderConfig = {
    list: testList
}

let fixedProvider = new FixedProvider(testList)

beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => { });
    jest.spyOn(console, 'log').mockImplementation(() => { });
});

test('FixedProvider -> performSearch -> should return recommendationResult with matching items, when valid searchConditions are given', () => {
    expect(
        fixedProvider.performSearch(validSearchConditions, pageSize)
    ).toEqual(recommendationResult);
});

test('FixedProvider -> performSearch -> should return recommendationResult with unfiltered items from complete list, when no searchConditions are provided', () => {
    let expectedRecommendationResult = {
        "recommendations": {
            "itemCount": 2,
            "items": [
                itemOne,
                itemTwo
            ],
            "nextPageToken": "2",
            "prevPageToken": undefined
        },
        "rescoped": false,
        "searchConditions": emptySearchConditions
    }

    expect(
        fixedProvider.performSearch(emptySearchConditions, pageSize)
    ).toEqual(expectedRecommendationResult);
});

test('FixedProvider -> performSearch -> should return recommendationResult with unfiltered items from complete list, when valid searchConditions doesnt give any items', () => {

    let expectedRecommendationResult = {
        "offer": undefined,
        "recommendations": {
            "itemCount": 2,
            "items": [
                itemOne,
                itemTwo
            ],
            "nextPageToken": undefined,
            "prevPageToken": undefined
        },
        "rescoped": true,
        "searchConditions": {}
    }

    const searchConditions = {
        [searchAttribute]: searchAttributeValueNotMatching
    };

    expect(
        fixedProvider.performSearch(searchConditions, pageSize)
    ).toEqual(expectedRecommendationResult);
});

test('FixedProvider -> performSearch -> should return recommendationResult with unfiltered items from complete list, when searchConditions have empty value in search keys', () => {
    let expectedRecommendationResult = {
        "recommendations": {
            "itemCount": 2,
            "items": [
                itemOne,
                itemTwo
            ],
            "nextPageToken": "2",
            "prevPageToken": undefined
        },
        "rescoped": false,
        "searchConditions": {
            [searchAttribute]: "",
        }
    }

    const searchConditions = {
        [searchAttribute]: ""
    }

    expect(
        fixedProvider.performSearch(searchConditions, pageSize)
    ).toEqual(expectedRecommendationResult);
});

test('FixedProvider -> getRecommendationsPage -> should return recommendationResult with matching items, when valid searchConditions are provided', () => {
    expect(
        fixedProvider.getRecommendationsPage(validSearchConditions, pageSize, "0", PagingDirection.NEXT)
    ).toEqual(recommendationResult);
});

test('FixedProvider -> getRecommendationsPage -> should return recommendationResult with no items, when valid searchConditions are provided and pageToken is at last item in list', () => {
    let recommendationResult = {
        "recommendations": {
            "itemCount": 0,
            "items": [],
            "nextPageToken": undefined,
            "prevPageToken": "1"
        },
        "rescoped": false,
        "searchConditions": {
           [searchAttribute]: searchAttributeValueMatching,
        }
    }

    expect(
        fixedProvider.getRecommendationsPage(validSearchConditions, pageSize, "3", PagingDirection.NEXT)
    ).toEqual(recommendationResult);
});

test('FixedProvider -> selectItem -> should return correct recommendationResult with selected item at given index', () => {
    expect(
        fixedProvider.selectItem(page, 0)
    ).toEqual(selectItemRecommendationResult);
});

test('FixedProvider -> getProperty -> should return correct propertyResult, when item and correct search attribute are provided', () => {
    expect(
        fixedProvider.getProperty(itemOne, searchAttribute)
    ).toEqual(validPropertyResult);
});

test('FixedProvider -> getProperty -> should throw error, when invalid object type is provided', () => {

    const invalidObject = 2;
    expect(() => {
        fixedProvider.getProperty(invalidObject, searchAttribute)
    }).toThrow(new Error("Item isn't an object"));
});

test('FixedProvider -> performAction -> should return correct actionResult, when item and actionName is provided', () => {
    const expectedActionResult = "Result: Action successfully performed";
    expect(
        fixedProvider.performAction(itemOne, validActionName)
    ).toEqual(expectedActionResult);
});

test('FixedProvider -> getName -> should return fixedProvider name', () => {
    expect(
        fixedProvider.getName()
    ).toEqual(FixedProvider.NAME);
});

test('FixedProvider -> serialize -> should return fixedProvider config', () => {
    const newFixedProviderConfig = {
        ...fixedProviderConfig,
        seenList: testSeenList,
        prevPageLength: 0
    }
    expect(
        fixedProvider.serialize()
    ).toEqual(newFixedProviderConfig);
});

test('FixedProvider -> deserialize -> should return new FixedProvider object, when valid fixedProvider config is provided', () => {
    expect(
        FixedProvider.deserialize(fixedProviderConfig)
    ).toEqual(new FixedProvider(fixedProviderConfig.list));
});