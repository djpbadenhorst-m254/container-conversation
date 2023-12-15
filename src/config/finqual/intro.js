let introWithMessage = [
  {
    code: 'WAP/FINQUAL/INIT_WITH_MESSAGE',
    incChannel: 'WHATSAPP',
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_BOT', check: true },
    ]
  }, // WAP/FINQUAL/INIT_WITH_MESSAGE
  {
    code: 'WAP/FINQUAL/INTRO_BOT',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Hello! Thank you for messaging Money254. ` +
	    `I am the Money254 virtual application assistant, and I am here to help you with your search.\n\n` + 
	    `What are you looking for today? Let me know by selecting an option using list below.\n\n` + 
	    `Click "Select an Option" to begin`,
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:'1', title: 'Logbook Loan' },
		{ id:'2', title: 'Checkoff Loan' },
		{ id:'3', title: 'SME Loan' },
		{ id:'4', title: `I'm not sure yet` },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {product_category:"Checkoff Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {product_category:"SME Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_BOT_ERROR', check: true},
    ]
  }, // WAP/FINQUAL/INTRO_BOT
  {
    code: 'WAP/FINQUAL/INTRO_BOT_ERROR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please click on the list below and then click on the product you are interested in.\n` + 
	    `Select an option below`,
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:'1', title: 'Logbook Loan' },
		{ id:'2', title: 'Checkoff Loan' },
		{ id:'3', title: 'SME Loan' },
		{ id:'4', title: `I'm not sure yet` },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {product_category:"Checkoff Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {product_category:"SME Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_BOT_ERROR', check: true},
    ]
  }, // WAP/FINQUAL/INTRO_BOT_ERROR
];
let introWithApi = [
  {
    code: 'WAP/FINQUAL/INIT_WITH_API',
    incChannel: 'WHATSAPP',
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_TEMPLATE', check: true },
    ]
  }, // WAP/FINQUAL/INIT_WITH_API
  {
    code: 'WAP/FINQUAL/INTRO_TEMPLATE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: 'template',
      template: {
	name: "application_confirmation_and_prequal_request",
	language: { code: "en" },
	components: [{
          type: "body",
          parameters: [
            { type: "text", text: "{{ first_name }}" },
            { type: "text", text: "{{ product_category }}" },
            { type: "text", text: "{{ entrypoint }}" },
	  ],
	}],
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NOT_INTERESTED', check: { '==': [{'lower': {'trim': {'var': 'incMessage'}}}, 'no longer interested'] }},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: true },
    ]
  }, // WAP/FINQUAL/INTRO_TEMPLATE
  {
    code: 'WAP/FINQUAL/INTRO_NOT_INTERESTED',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    closeConversation: true,
    outMessage: {
      type: "text",
      text: {
	body:`Thank you for your feedback.\n\n` + 
	  `If your circumstances change and you are interested in a loan in the future, ` +
	  `please don't hesitate to reach out to me on this chat and I am happy to help you with another application.`
      },
    },
  }, // WAP/FINQUAL/INTRO_NOT_INTERESTED
];
let introQuestions = [
  {
    code: 'WAP/FINQUAL/INTRO_PRODUCT',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Great! To start, please select what product you are interested in taking.\n` + 
	    `Please select an option from the list below.`,
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:'1', title: 'Logbook Loan' },
		{ id:'2', title: 'Checkoff Loan' },
		{ id:'3', title: 'SME Loan' },
		{ id:'4', title: `I'm not sure yet` },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {product_category:"Checkoff Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {product_category:"SME Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_PRODUCT_ERROR', check: true},
    ]
  }, // WAP/FINQUAL/INTRO_PRODUCT
  {
    code: 'WAP/FINQUAL/INTRO_PRODUCT_ERROR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please click on the Select an Option button below and then click on the product you are interested in.\n` + 
	    `Click "Select an Option" to respond.\n`,
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:'1', title: 'Logbook Loan' },
		{ id:'2', title: 'Checkoff Loan' },
		{ id:'3', title: 'SME Loan' },
		{ id:'4', title: `I'm not sure yet` },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {product_category:"Checkoff Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {product_category:"SME Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_NAME', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {product_category:"Logbook Loan"}},
      { nextCode:'WAP/FINQUAL/INTRO_PRODUCT_ERROR', check: true},
    ]
  }, // WAP/FINQUAL/INTRO_PRODUCT_ERROR
  {
    code: 'WAP/FINQUAL/INTRO_NAME',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Okay, got it. And before we proceed, What is your full name?\n` + 
	  `Please respond with your full name only.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME_ERROR', check: {'and': [
	{"isNum": {"var": "incMessage"}},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT', check: { '==': [{'lower': {'trim': {'var': 'product_category'}}}, 'checkoff loan'] }, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT', check: { '==': [{'lower': {'trim': {'var': 'product_category'}}}, 'sme loan'] }, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT', check: true, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      } },
    ]
  }, // WAP/FINQUAL/INTRO_NAME
  {
    code: 'WAP/FINQUAL/INTRO_NAME_ERROR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`I'm sorry, that doesn't appear to be a valid name.\n` + 
	  `Could you please tell me your full name so we can proceed? I use your name to help expedite your callback from an agent.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/INTRO_NAME_ERROR', check: {'and': [
	{"isNum": {"var": "incMessage"}},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT', check: { '==': [{'lower': {'trim': {'var': 'product_category'}}}, 'checkoff loan'] }, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
      { nextCode:'WAP/FINQUAL/SME_LOAN_AMOUNT', check: { '==': [{'lower': {'trim': {'var': 'product_category'}}}, 'sme loan'] }, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT', check: true, store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      } },
    ]
  }, // WAP/FINQUAL/INTRO_NAME_ERROR
];

module.exports={
  intro: [
    ...introWithMessage,
    ...introWithApi,
    ...introQuestions,
  ]
};
