import { dialog, Slot } from "ask-sdk-model";
import DelegateRequestDirective = dialog.DelegateRequestDirective;
import DelegationPeriod = dialog.DelegationPeriod;
import UpdatedInputRequest = dialog.UpdatedInputRequest;
import UpdatedIntentRequest = dialog.UpdatedIntentRequest;
import Input = dialog.Input;

/**
 * Creates a directive to delegate control to target
 */
export class DelegateRequestDirectiveBuilder {
    private target: string;
    private updateRequest: UpdatedInputRequest | UpdatedIntentRequest;
    static readonly ALEXA_CONVERSATIONS_TARGET: string = 'AMAZON.Conversations';
    static readonly SKILL_TARGET: string = 'skill';
    static readonly DIALOG_INPUT_REQUEST_TYPE = 'Dialog.InputRequest';

    withTarget(target: string): DelegateRequestDirectiveBuilder {
        this.target = target;
        return this;
    }

    withUpdateRequest(updateRequest: UpdatedInputRequest | UpdatedIntentRequest): DelegateRequestDirectiveBuilder {
        this.updateRequest = updateRequest;
        return this;
    }

    static transformSlot(slots: Slot[]): { [key: string]: Slot } {
        const transformedSlots: { [key: string]: Slot } = {};
        slots.forEach((slot) => {
            transformedSlots[slot.name] = slot;
        });
        return transformedSlots;
    }

    build(): DelegateRequestDirective {
        const period: DelegationPeriod = {
            until: 'EXPLICIT_RETURN'
        };

        const delegateRequestDirective: DelegateRequestDirective = {
            target: this.target,
            period: period,
            updatedRequest: this.updateRequest,
            type: 'Dialog.DelegateRequest'
        };

        return delegateRequestDirective;
    }
}

/**
 * Creates a {@link UpdatedInputRequest} update request
 */
export class UpdatedInputRequestBuilder {
    private inputName: string;
    private slots: { [key: string]: Slot };

    withInputName(inputName: string): UpdatedInputRequestBuilder {
        this.inputName = inputName;
        return this;
    }

    withSlots(slots: { [key: string]: Slot }): UpdatedInputRequestBuilder {
        this.slots = slots;
        return this;
    }

    build(): UpdatedInputRequest {
        const updatedInputRequest = {
            input: {
                name: this.inputName,
                slots: this.slots
            } as Input,
            type: 'Dialog.InputRequest'
        } as UpdatedInputRequest;

        return updatedInputRequest;
    }
}
