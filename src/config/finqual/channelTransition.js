let channelTransition = [
  {
    code: 'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Unfortunately you don't qualify for this product.\n\n` +
	  `That's okay, we have other products you may qualify for. Would you like me to see if you can qualify for our other products now?`,
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:'1', title: 'Yes Please' },
		{ id:'2', title: 'No Thanks' },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NOT_INTERESTED', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_sme"}, true]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: true},
    ]
  }, // WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION
  {
    code: 'WAP/FINQUAL/DOES_NOT_QUALIFY',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    closeConversation: true,
    outMessage: {
      type: "text",
      text: {
	body:`I've just searched through our product catalog and unfortunately you do not currently qualify for any loan product we offer.\n` + 
	    `If your circumstances change, please do not hesitate to get back in touch by messaging this chat and we can prequalify you for one of our loans.`,
      },
    }
  }, // WAP/FINQUAL/DOES_NOT_QUALIFY
  {
    code: 'WAP/FINQUAL/CONSENT_REQUEST',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Great, that's all I need to prequalify you and expedite your application processing!\n\n` + 
	  `Before I do, do you consent to getting a callback from a Money254 Agent? We need your consent to call you.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Yes" },
		{ id:"2", title: "No" },
              ]
	    },
	  ]
	}
      }
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'logbook loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [
	  {"keyValPair": ["entrypoint", {"var": "entrypoint"}]},
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["mag_score", {"var": "mag_score"}]},
	  {"keyValPair": ["owns_vehicle", {"var": "owns_vehicle"}]},
	  {"keyValPair": ["owns_logbook", {"var": "owns_logbook"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["owned_vehicle_model", {"var": "owned_vehicle_model"}]},
	  {"keyValPair": ["owned_vehicle_insurance_type", {"var": "owned_vehicle_insurance_type"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'checkoff loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [
	  {"keyValPair": ["entrypoint", {"var": "entrypoint"}]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["mag_score", {"var": "mag_score"}]},
	  {"keyValPair": ["gross_salary", {"var": "gross_salary"}]},
	  {"keyValPair": ["employment_sector", {"var": "employment_sector"}]},
	  {"keyValPair": ["employment_status", {"var": "employment_status"}]},
	  {"keyValPair": ["salary_deductions", {"var": "salary_deductions"}]},
	  {"keyValPair": ["employment_organization", {"var": "employment_organization"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'sme loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [
	  {"keyValPair": ["entrypoint", {"var": "entrypoint"}]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["mag_score", {"var": "mag_score"}]},
	  {"keyValPair": ["owns_business", {"var": "owns_business"}]},
	  {"keyValPair": ["sme_guarantor", {"var": "sme_guarantor"}]},
	  {"keyValPair": ["sme_business_type", {"var": "sme_business_type"}]},
	  {"keyValPair": ["sme_business_income", {"var": "sme_business_income"}]},
	  {"keyValPair": ["sme_business_category", {"var": "sme_business_category"}]},
	  {"keyValPair": ["sme_business_duration", {"var": "sme_business_duration"}]},
	  {"keyValPair": ["sme_business_registration", {"var": "sme_business_registration"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_DENIED', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: { consent_given:false } },
      { nextCode:'WAP/FINQUAL/CONSENT_REQUEST_ERROR1', check: true},
    ]
  }, // WAP/FINQUAL/CONSENT_REQUEST
  {
    code: 'WAP/FINQUAL/CONSENT_REQUEST_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I don't understand your answer.\n` + 
	    `Please click on either the *Yes* or *No* button below to tell me if you consent to being contacted by Money254.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Yes" },
		{ id:"2", title: "No" },
              ]
	    },
	  ]
	}
      }
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'logbook loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["mag_score", {"var": "mag_score"}]},
	  {"keyValPair": ["owns_vehicle", {"var": "owns_vehicle"}]},
	  {"keyValPair": ["owns_logbook", {"var": "owns_logbook"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["owned_vehicle_model", {"var": "owned_vehicle_model"}]},
	  {"keyValPair": ["owned_vehicle_insurance_type", {"var": "owned_vehicle_insurance_type"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'checkoff loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [	  
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["gross_salary", {"var": "gross_salary"}]},
	  {"keyValPair": ["employment_sector", {"var": "employment_sector"}]},
	  {"keyValPair": ["employment_status", {"var": "employment_status"}]},
	  {"keyValPair": ["salary_deductions", {"var": "salary_deductions"}]},
	  {"keyValPair": ["employment_organization", {"var": "employment_organization"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_GIVEN', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{ '==': [{'lower': {'trim': {'var': 'applying_for'}}}, 'sme loan'] },
      ]}, store: {
	webscreen_status: {"finqualApiCall": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "location"}]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["applying_for", {"var": "applying_for"}]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owns_business", {"var": "owns_business"}]},
	  {"keyValPair": ["sme_guarantor", {"var": "sme_guarantor"}]},
	  {"keyValPair": ["sme_business_type", {"var": "sme_business_type"}]},
	  {"keyValPair": ["sme_business_income", {"var": "sme_business_income"}]},
	  {"keyValPair": ["sme_business_category", {"var": "sme_business_category"}]},
	  {"keyValPair": ["sme_business_duration", {"var": "sme_business_duration"}]},
	  {"keyValPair": ["sme_business_registration", {"var": "sme_business_registration"}]},
	]}
      }},
      { nextCode:'WAP/FINQUAL/CONSENT_DENIED', check: true, store: { consent_given:false } },
    ]
  }, // WAP/FINQUAL/CONSENT_REQUEST_ERROR1
  {
    code: 'WAP/FINQUAL/CONSENT_GIVEN',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    closeConversation: true,
    outMessage: {
      type: "text",
      text: {
	body:`Thanks, {{ first_name }}. Based on the information you've provided, you are prequalified for our {{ applying_for }}.\n\n` + 
	  `A Money254 agent will call you on this number shortly to discuss the terms and process your application. ` +
	  `I have sent the agent the information we just chatted about to help them expedite the process.\n\n` + 
	  `Thank you for chatting with me today. Have a great day!`
      },
    }
  }, // WAP/FINQUAL/CONSENT_GIVEN
  {
    code: 'WAP/FINQUAL/CONSENT_DENIED',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    closeConversation: true,
    outMessage: {
      type: "text",
      text: {
	body:`Okay, we will not contact you.\n` + 
	  `If your circumstances change and you are interested in the loan, please don't hesitate to reach out to me on this chat and I am happy to help with your application.`,
      },
    }
  }, // WAP/FINQUAL/CONSENT_DENIED
];

module.exports={
  channelTransition: [
    ...channelTransition,
  ]
};
