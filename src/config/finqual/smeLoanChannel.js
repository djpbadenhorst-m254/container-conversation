let smeLoanAmount = [
  {
    code: 'WAP/FINQUAL/SME_LOAN_AMOUNT',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Thanks, {{ first_name }}. I'll now ask you some questions to help expedite your application.\n` + 
	  `First, what loan amount are you looking for?`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/SME_LOAN_AMOUNT
  {
    code: 'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`A {{ product_category }} has a minimum loan amount of 3000.\n` +
	`Please enter an amount greater than 3000.\n` +
	`Or type 0 to go back to the start and choose a different loan type.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR1
  {
    code: 'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the loan amount your are requesting using numbers only.\n` +
	  `You can always update this loan loan amount when you speak with an agent over the phone.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 3000]},
      ]}},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/SME_LOAN_AMOUNT_ERROR2
];
let smeEmploymentType = [
  {
    code: 'WAP/FINQUAL/SME_EMPLOYMENT_TYPE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Do you currently own a business?`
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
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_business:true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/SME_EMPLOYMENT_TYPE
  {
    code: 'WAP/FINQUAL/SME_EMPLOYMENT_TYPE_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I don't understand your answer.\n` +
	  `Please click on either the *Yes* or *No* button below.`
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
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_business:true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/SME_EMPLOYMENT_TYPE_ERROR1
]; // hard
let smeBusinessType = [
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_TYPE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What type of business do you operate?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "I sell Goods" },
		{ id:"2", title: "I provide Services" },
		{ id:"3", title: "I am a Farmer" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_CATEGORY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_business_type:"Sells Goods"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_CATEGORY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_type:"Service Provider"}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_TYPE
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please press on the *Select Business Type* button below and then select on your answer.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "I sell Goods" },
		{ id:"2", title: "I provide Services" },
		{ id:"3", title: "I am a Farmer" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_CATEGORY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_business_type:"Sells Goods"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_CATEGORY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_type:"Service Provider"}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1
]; // hard
let smeBusinessCategory = [
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_CATEGORY',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please describe your business in a short sentence`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_DURATION', check: true , store: {
	sme_business_category: {"var": "incMessage"}
      }}
    ]
  }, // WAP/FINQUAL/SME_BUSINESS_CATEGORY
];
let smeBusinessDuration = [
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_DURATION',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `How long have you been in operation?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Less than 6 Months" },
		{ id:"2", title: "6 - 12 months" },
		{ id:"3", title: "12 - 24 months" },
		{ id:"4", title: "More than 24 Months" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_duration:"6 - 12 Months"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {sme_business_duration:"12 - 24 Months"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {sme_business_duration:"More than 24 Months"}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_DURATION
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_DURATION_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	  `Please press on the *Select an Option* button below and then select on your answer.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Less than 6 Months" },
		{ id:"2", title: "6 - 12 months" },
		{ id:"3", title: "12 - 24 months" },
		{ id:"4", title: "More than 24 Months" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_duration:"6 - 12 Months"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {sme_business_duration:"12 - 24 Months"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {sme_business_duration:"More than 24 Months"}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_logbook"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"!=": [{"var": "failed_logbook"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_sme: true}},
      
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_TYPE_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_DURATION_ERROR1
]; // hard
let smeBusinessRegistration = [
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_REGISTRATION',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What is the current registration status of your business?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Not Registered" },
		{ id:"2", title: "County Permit" },
		{ id:"3", title: "Trading License" },
		{ id:"4", title: "Cert of Registration" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_business_registration:"Not Registered"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_registration:"County Permit"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {sme_business_registration:"Trading License"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {sme_business_registration:"Cert of Registration"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_REGISTRATION
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_REGISTRATION_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please press on the *Select a Status* button below and then select on your answer.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Not Registered" },
		{ id:"2", title: "County Permit" },
		{ id:"3", title: "Trading License" },
		{ id:"4", title: "Cert of Registration" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_business_registration:"Not Registered"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_business_registration:"County Permit"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {sme_business_registration:"Trading License"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {sme_business_registration:"Cert of Registration"}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_REGISTRATION_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_REGISTRATION_ERROR1
];
let smeBusinessIncome = [
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_INCOME',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Approximately what is the value of your total monthly sales?\n` + 
	  `Please enter the full value including all 0s. For example, "150000".`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_GUARANTOR', check: { "and": [
	{"isNum": {"var": "incMessage"}},
      ]}, store: {sme_business_income: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_INCOME
  {
    code: 'WAP/FINQUAL/SME_BUSINESS_INCOME_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter your business' approximate total monthly sales using numbers only.\n` +  
	  `For example, "150000"`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/SME_GUARANTOR', check: { "and": [
	{"isNum": {"var": "incMessage"}},
      ]}, store: {sme_business_income: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/SME_BUSINESS_INCOME_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/SME_BUSINESS_INCOME_ERROR1
];
let smeGuarantor = [
  {
    code: 'WAP/FINQUAL/SME_GUARANTOR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Do you have three guarantors you could currently mobilize?`
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
      { nextCode:'WAP/FINQUAL/SME_LOCATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_guarantor: true}},
      { nextCode:'WAP/FINQUAL/SME_LOCATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_guarantor: false}},
      { nextCode:'WAP/FINQUAL/SME_GUARANTOR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/SME_GUARANTOR
  {
    code: 'WAP/FINQUAL/SME_GUARANTOR_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I don't understand your answer.\n` + 
	    `Please click on either the *Yes* or *No* button below to tell me your answer.`
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
      { nextCode:'WAP/FINQUAL/SME_LOCATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {sme_guarantor: true}},
      { nextCode:'WAP/FINQUAL/SME_LOCATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {sme_guarantor: false}},
      { nextCode:'WAP/FINQUAL/SME_GUARANTOR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/SME_GUARANTOR_ERROR1
];
let smeLocation = [
  {
    code: 'WAP/FINQUAL/SME_LOCATION',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is your current location's county?\n` + 
	  `Please enter two name counties in the following format: "Taita-Taveta"`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CONSENT_REQUEST', check: true , store: {
	applying_for: 'SME Loan',
	location: {"var": "incMessage"},
      	mag_score: {calcMagScore: [
	  {"keyValPair": ["applying_for", "SME Loan"]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "incMessage"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owns_business", {"var": "owns_business"}]},
	  {"keyValPair": ["sme_guarantor", {"var": "sme_guarantor"}]},
	  {"keyValPair": ["sme_business_type", {"var": "sme_business_type"}]},
	  {"keyValPair": ["sme_business_income", {"var": "sme_business_income"}]},
	  {"keyValPair": ["sme_business_category", {"var": "sme_business_category"}]},
	  {"keyValPair": ["sme_business_duration", {"var": "sme_business_duration"}]},
	  {"keyValPair": ["sme_business_registration", {"var": "sme_business_registration"}]},
	]},
      }},
    ]
  }, // WAP/FINQUAL/CHECKOFF_LOCATION
];

module.exports={
  smeLoanChannel: [
    ...smeLoanAmount,
    ...smeEmploymentType,
    ...smeBusinessType,
    ...smeBusinessCategory,
    ...smeBusinessDuration,
    ...smeBusinessRegistration,
    ...smeBusinessIncome,
    ...smeGuarantor,
    ...smeLocation,
  ]
};
