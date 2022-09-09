import { HandlerInput, RequestHandler } from 'ask-sdk-core';
import { Response } from 'ask-sdk-model';
import { Constants } from "../util/Constants";
import { UtilsHelper } from "../util/Helper";
import { Product } from '../models/Product';
import { MonetizationServiceClientException } from '../exception/MonetizationServiceClientException';

/**
 * Get in-skill product list API Call
 */
export class GetInSkillProductListHandler implements RequestHandler {
    private utilsHelper: UtilsHelper;

    constructor() {
        this.utilsHelper = new UtilsHelper();
    }

    canHandle(handlerInput: HandlerInput): boolean {
        return this.utilsHelper.isApiRequest(handlerInput, Constants.GET_IN_SKILL_PRODUCTS_API)
    }

    async handle(handlerInput: HandlerInput): Promise<Response> {
        console.log('Calling Handler for {}', Constants.GET_IN_SKILL_PRODUCTS_API);
        const inSkillProductList: Product[] = [];      
        const locale = this.utilsHelper.getLocale(handlerInput);
        const serviceClientFactory = handlerInput.serviceClientFactory;

        if(serviceClientFactory) {
            // Filter the returned ISP products that are available for purchase (NOT ENTITLED) and also only with type of subscription
            const nextToken = undefined;
            const maxResults = undefined;
            return serviceClientFactory.getMonetizationServiceClient()
                .getInSkillProducts(locale, Constants.PURCHASABLE, Constants.NOT_ENTITLED, Constants.SUBSCRIPTION, nextToken, maxResults)
                .then((result) => {
                    result.inSkillProducts
                        .map(record => inSkillProductList.push({
                            productId: record.productId,
                            productName: record.name,
                            productSummary: record.summary
                        } as Product));

                    return handlerInput.responseBuilder
                        .withApiResponse({ inSkillProductList: inSkillProductList})
                        .withShouldEndSession(false)
                        .getResponse();
                })
                .catch((error) => {
                    throw new MonetizationServiceClientException('Failed in getting in skill product list, error: ' + error);
                });
        } else {
            throw new MonetizationServiceClientException("There is no valid monetizationClient. Please add default api client in SkillBuilder.");
        }      
    }
}