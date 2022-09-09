export class Constants {
    // Skill Request Type Constants
    static readonly LAUNCH_REQUEST = 'LaunchRequest';
    
    // Namespace constants
    static readonly IN_SKILL_PURCHASE_RD_NAMESPACE_AC = 'com.amazon.alexa.skill.components.inSkillPurchase';
    static readonly PURCHASE_DIALOG_AC = Constants.IN_SKILL_PURCHASE_RD_NAMESPACE_AC + '.purchase';
    static readonly RESUME_DIALOG_AC = Constants.IN_SKILL_PURCHASE_RD_NAMESPACE_AC + '.resume';
    static readonly UPSELL_DIALOG_AC = Constants.IN_SKILL_PURCHASE_RD_NAMESPACE_AC + '.upsell';
    static readonly CANCEL_DIALOG_AC = Constants.IN_SKILL_PURCHASE_RD_NAMESPACE_AC + '.cancel';
    // API Constants
    static readonly GET_IN_SKILL_PRODUCTS_API = Constants.PURCHASE_DIALOG_AC + '.getInSkillProductList';
    static readonly SEND_BUY_DIRECTIVE_API = Constants.PURCHASE_DIALOG_AC + '.sendBuyDirective';
    static readonly DELEGATE_FLOW_FOR_DENY_API = Constants.PURCHASE_DIALOG_AC + '.delegateFlowForDeny';
    static readonly GET_PRODUCT_ID_API = Constants.PURCHASE_DIALOG_AC + '.getProductID';
    static readonly GET_PURCHASE_RESULT = Constants.RESUME_DIALOG_AC + '.getPurchaseResult';
    static readonly RESUME_RESPONSE = Constants.RESUME_DIALOG_AC + '.resumeResponse';
    
    // Event Constants
    static readonly RESUME_EVENT = Constants.RESUME_DIALOG_AC + '.resumeEvent';

    static readonly SEND_UPSELL_DIRECTIVE_API = Constants.UPSELL_DIALOG_AC + '.sendUpsellDirective';
    static readonly SEND_CANCEL_DIRECTIVE_API = Constants.CANCEL_DIALOG_AC + '.sendCancelDirective';
    // ISP Constants
    static readonly PURCHASABLE = 'PURCHASABLE';
    static readonly NOT_ENTITLED = 'NOT_ENTITLED';
    static readonly SUBSCRIPTION = 'SUBSCRIPTION';
    static readonly BUY = "Buy";
    static readonly SEND_REQUEST = "Connections.SendRequest";
    static readonly ISP_CONNECTIONS_RESPONSE = 'Connections.Response';
    static readonly UPSELL = "Upsell";
    static readonly CANCEL = 'Cancel';
}