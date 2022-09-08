export class MonetizationServiceClientException extends Error {
    constructor(message: string) {
        super("MonetizationServiceClientException: " + message);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MonetizationServiceClientException.prototype);
    }
}