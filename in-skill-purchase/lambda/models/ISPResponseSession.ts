import { interfaces } from 'ask-sdk-model';

export interface ISPResponseSession {
    name: ISPActionName;
    purchaseResult: interfaces.monetization.v1.PurchaseResult;
}

/**
 * Name of the action for which response is received. Indicates the target for the SendRequest message.
 * Buy - for a buy request
 * Upsell - for a purchase suggestion
 * Cancel - for a cancellation or refund request 
 */
export enum ISPActionName {
    Buy = 'Buy',
    Upsell = 'Upsell',
    Cancel = 'Cancel'
}