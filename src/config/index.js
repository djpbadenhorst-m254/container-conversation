const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const syncFetch = require('sync-fetch');
const _ = require("lodash");

const jsonLogic = require('json-logic-js');
jsonLogic.add_operation('lower', (a)=>a.toLowerCase());
jsonLogic.add_operation('trim', (a)=>a.trim());
jsonLogic.add_operation('isNum', (a)=>!isNaN(a.trim()));
jsonLogic.add_operation('castToNum', (a)=>parseFloat(a.trim()));
jsonLogic.add_operation('extractFirstName', (a)=>a.trim().split(' ')[0]);
jsonLogic.add_operation('extractLastName', (a)=>a.trim().split(' ').splice(1).join(' '));
jsonLogic.add_operation('keyValPair', (a,b)=>[a,b]);
jsonLogic.add_operation('removePhonePrefix', (a)=>a.replaceAll('+254','0').replaceAll('+27','0'));
jsonLogic.add_operation('createLoanApplication', (...args)=>{
  let data = args.reduce((a,b)=>({[b[0]]:b[1],...a}),{});
  let application = syncFetch(
    'https://m254-maverick-stg-directus-ndfhdd4obq-ew.a.run.app/items/loan_applications', {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
	'Content-Type': 'application/json',
	'Authorization': `Bearer 1bb822a6-8b75-11ed-9f51-3bad9be27fcd`,
      }
    }).json();
  return application.data.webscreen_status;
});
jsonLogic.add_operation('calcLogbookLoanOptions', (initial_loan_amount)=>{
  let response = syncFetch(
    `${process.env['DIRECTUS_URL']}/quotes/calc_min_payment?take_home=${initial_loan_amount}&details=false`, {
      method: 'post',
      body: JSON.stringify({"filter": {"_and": [{"visible_on_logbook_loans":{"_eq": true}}]}}),
      headers: {
	'Content-Type': 'application/json',
      }
    }).json();
  return JSON.stringify({
    num_loans: response.data.length,
    min_loan_payment: _.min(response.data.map(x=>x.total_monthly_cost))
  });
});

let pocBotConfig = [
  {
    code: 'INIT',
    responses: [
      { nextCode:'POC1', check: { '==': [{'lower': {'trim': {'var': 'incMessage'}}}, 'hi'] }},
      { nextCode:'?', check: true },
    ]
  }, //INIT
  {
    code: 'POC1',
    outChannel: 'SMS',
    outMessage: `Hello! Thank you for messaging Money254. We are Kenyas premier loan comparison platform. What are you looking for today?\n` +
      `1 - Logbook Loan\n` +
      `2 - Business Unsecured Working Capital Loan\n` +
      `3 - Personal Loan\n` +
      `4 - Another Type of Loan\n` +
      `Please reply with a number representing the financial product you are looking for today.`,
    responses: [
      { nextCode:'POC2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'?', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 5]},
      ]}},
      { nextCode:'POC1_RETRY', check: true},
    ]
  }, //POC1
  {
    code: 'POC1_RETRY',
    outChannel: 'SMS',
    outMessage: `Please reply with a number representing the financial product you are looking for today.\n` +
      `1 - Logbook Loan\n` +
      `2 - Business Unsecured Working Capital Loan\n` +
      `3 - Personal Loan\n` +
      `4 - Another Type of Loan\n`,
    responses: [
      { nextCode:'POC2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 5]},
      ] }},
      { nextCode:'POC1_RETRY', check: true},
    ]
  }, //POC1_RETRY
  {
    code: 'POC2',
    outChannel: 'SMS',
    outMessage: `Great. Before we get started, what is your full name?`,
    responses: [
      { nextCode:'POC3', check: true , store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
    ]
  }, //POC2
  {
    code: 'POC3',
    outChannel: 'SMS',
    outMessage: `Great! We can help you compare your logbook loan options over our chat. First, how much financing are you looking for?`,
    responses: [
      { nextCode:'POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'POC3_RETRY2', check: true },
    ]
  }, //POC3
  {
    code: 'POC3_RETRY1',
    outChannel: 'SMS',
    outMessage: `Logbook Loans have a minimum loan amount of 50000. ` +
      `Please enter a Loan amount of greater than 50000 if you are still interested in taking a Logbook Loan. ` +
      `Or, if you would like to choose a Personal Loan with a lower loan amount, type 0 to go back to the start.`,
    responses: [
      { nextCode:'POC1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'POC3_RETRY2', check: true },
    ]
  }, //POC3_RETRY1
  {
    code: 'POC3_RETRY2',
    outChannel: 'SMS',
    outMessage: `Please enter the amount as a number only? You can type it again here. For example: 50000`,
    responses: [
      { nextCode:'POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC3_RETRY2', check: true },
    ]
  }, //POC3_RETRY2
  {
    code: 'POC4',
    outChannel: 'SMS',
    outMessage:`Okay, we will look search for {{initial_loan_amount}}. We now have some questions to identify which loans you qualify for. ` +
      `First, what type of vehicle do you own?\n` +
      `Please reply with a number representing your answer.\n` +
      `1 - Private Car, Truck, or SUV\n` + 
      `2 - Commercial Truck\n` + 
      `3 - PSV or Uber\n` + 
      `4 - Boda Boda or Tuk Tuk\n` + 
      `5 - I do not currently own a vehicle\n`,
    responses: [
      { nextCode:'POC5', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 6]},
      ]}, store: {
	owned_vehicle_type: {"if" : [
	  {"==": [{"var":"incMessage"}, 1] }, "Private Car, Truck, or SUV",
	  {"==": [{"var":"incMessage"}, 2] }, "Commercial Truck",
	  {"==": [{"var":"incMessage"}, 3] }, "PSV or Uber",
	  {"==": [{"var":"incMessage"}, 4] }, "Boda Boda or Tuk Tuk",
	  {"==": [{"var":"incMessage"}, 5] }, "I do not currently own a vehicle",
	  'NA'
	]},
      }},
      { nextCode:'POC4_RETRY', check: true},
    ]
  }, //POC4
  {
    code: 'POC4_RETRY',
    outChannel: 'SMS',
    outMessage:`The response received was invalid. ` +
      `What type of vehicle do you own?` +
      `Please reply with a number representing your answer. \n` +
      `1 - Private Car, Truck, or SUV\n` + 
      `2 - Commercial Truck\n` + 
      `3 - PSV or Uber\n` + 
      `4 - Boda Boda or Tuk Tuk\n` + 
      `5 - I do not currently own a vehicle\n`,
    responses: [
      { nextCode:'POC5', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 6]},
      ]}},
      { nextCode:'POC4_RETRY', check: true},
    ]
  }, //POC4_RETRY
  {
    code: 'POC5',
    outChannel: 'SMS',
    outMessage:`What is the Year of Manufacture of the Vehicle? Please respond with the year in YYYY format (i.e. 2020, 2021).`,
    responses: [
      { nextCode:'POC6', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 1900]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, new Date().getYear() + 1900]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC5_RETRY', check: true },
    ]
  }, //POC5
  {
    code: 'POC5_RETRY',
    outChannel: 'SMS',
    outMessage:`The response you sent is invalid. Please specify the Year of Manufacture of the Vehicle. ` +
      `Please respond with the year in YYYY format (i.e. 2020, 2021).`,
    responses: [
      { nextCode:'POC6', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 1900]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, new Date().getYear() + 1900]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'POC5_RETRY', check: true },
    ]
  }, //POC5_RETRY
  {
    code: 'POC6',
    outChannel: 'SMS',
    outMessage:`What is the estimated market value of the vehicle? Please enter with the full vehicle value (i.e. 500000).`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'POC6_RETRY2', check: true},
    ]
  }, //POC6
  {
    code: 'POC6_RETRY1',
    outChannel: 'SMS',
    outMessage:`Please enter the value of the car in full. For example, 500000 instead of 500.`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'POC6_RETRY2', check: true},
    ]
  }, //POC6_RETRY1
  {
    code: 'POC6_RETRY2',
    outChannel: 'SMS',
    outMessage:`Please enter the amount as a number only. You can type it again here. For example: 50000.`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'POC6_RETRY2', check: true},
    ]
  }, //POC6_RETRY2
  {
    code: 'POC7',
    outChannel: 'SMS',
    outMessage:`Congratulations {{ first_name }}, you may be prequalified for {{ logbook_loan_options_num_loans }} logbook loans of the amount {{ initial_loan_amount }}, ` +
      `with a starting monthly payment of {{ logbook_loan_options_min_loan_payment }}. `+
      `A Money254 agent will call you shortly from number 0746514628 to guide you through a tailored comparison of loan options. ` +
      `You can also view your personalized loan results on our website by clicking on this link:` + 
      `money254.info/logbook`,
    responses: [
      { nextCode:'CLOSED', check: true},
    ]
  }, //POC7
  {
    code: 'WA_INIT',
    responses: [
      { nextCode:'WA_POC1', check: { '==': [{'lower': {'trim': {'var': 'incMessage'}}}, 'hi'] }},
      { nextCode:'?', check: true },
    ]
  }, //WA_INIT
  {
    code: 'WA_POC1',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Hello! Thank you for messaging Money254. `+
	    `We are Kenyas premier loan comparison platform. What are you looking for today?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Logbook Loan" },
		{ id:"2", title: "Working Capital Loan" },
		{ id:"3", title: "Personal Loan" },
		{ id:"4", title: "Another Type of Loan" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WA_POC2', check: {'==': [{"var": "incMessage"}, '1']}},
      { nextCode:'?', check: {'!=': [{"var": "incMessage"}, '1']}},
    ]
  }, //WA_POC1
  {
    code: 'WA_POC2',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Great. Before we get started, what is your full name?`
      }
    },
    responses: [
      { nextCode:'WA_POC3', check: true , store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
    ]
  }, //WA_POC2
  {
    code: 'WA_POC3',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Great! We can help you compare your logbook loan options over our chat. ` +
	  `First, how much financing are you looking for?`
      }
    },
    responses: [
      { nextCode:'WA_POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WA_POC3_RETRY2', check: true },
    ]
  }, //WA_POC3
  {
    code: 'WA_POC3_RETRY1',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Logbook Loans have a minimum loan amount of 50000. ` +
	  `Please enter a Loan amount of greater than 50000 if you are still interested in taking a Logbook Loan. ` +
	  `Or, if you would like to choose a Personal Loan with a lower loan amount, type 0 to go back to the start.`,
      }
    },
    responses: [
      { nextCode:'WA_POC1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'WA_POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WA_POC3_RETRY2', check: true },
    ]
  }, //WA_POC3_RETRY1
  {
    code: 'WA_POC3_RETRY2',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the amount as a number only? You can type it again here. ` +
	  `For example: 50000`,
      }
    },
    responses: [
      { nextCode:'WA_POC4', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC3_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC3_RETRY2', check: true },
    ]
  }, //WA_POC3_RETRY2
  {
    code: 'WA_POC4',
    outChannel: 'WHATSAPP',
    outMessage:{
      type: "interactive",
      interactive: {
	type: "button",
	body: {
	  text: `Okay, we will look search for {{initial_loan_amount}}. We now have some questions to identify which loans you qualify for. ` +
	    `First, what type of vehicle do you own?\n` +
	    `Please reply with a number representing your answer.\n`
	},
	action: {
	  buttons: [
            {
              type: "reply",
              reply: { id: "1", title: "PrivCar/Truck/SUV" }
            },
            {
              type: "reply",
              reply: { id: "2", title: "Commercial Truck" }
            },
            {
              type: "reply",
              reply: { id: "3", title: "PSV or Uber" }
            },
	  ]
	}
      }
    },
    responses: [
      { nextCode:'WA_POC5', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 6]},
      ]}, store: {
	owned_vehicle_type: {"if" : [
	  {"==": [{"var":"incMessage"}, '1'] }, "Private Car, Truck, or SUV",
	  {"==": [{"var":"incMessage"}, '2'] }, "Commercial Truck",
	  {"==": [{"var":"incMessage"}, '3'] }, "PSV or Uber",
	  {"==": [{"var":"incMessage"}, '4'] }, "Boda Boda or Tuk Tuk",
	  {"==": [{"var":"incMessage"}, '5'] }, "I do not currently own a vehicle",
	  'NA'
	]},
      }},
      { nextCode:'WA_POC4_RETRY', check: true},
    ]
  }, //WA_POC4
  {
    code: 'WA_POC4_RETRY',
    outChannel: 'WHATSAPP',
    outMessage:`The response received was invalid. ` +
      `What type of vehicle do you own?` +
      `Please reply with a number representing your answer. \n` +
      `1 - Private Car, Truck, or SUV\n` + 
      `2 - Commercial Truck\n` + 
      `3 - PSV or Uber\n` + 
      `4 - Boda Boda or Tuk Tuk\n` + 
      `5 - I do not currently own a vehicle\n`,
    responses: [
      { nextCode:'WA_POC5', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 0]},
	{"<": [{"castToNum": {"var": "incMessage"}}, 6]},
      ]}},
      { nextCode:'WA_POC4_RETRY', check: true},
    ]
  }, //WA_POC4_RETRY
  {
    code: 'WA_POC5',
    outChannel: 'WHATSAPP',
    outMessage:{
      type: "text",
      text: {
	body:`What is the Year of Manufacture of the Vehicle? Please respond with the year in YYYY format (i.e. 2020, 2021).`,
      }
    },
    responses: [
      { nextCode:'WA_POC6', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 1900]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, new Date().getYear() + 1900]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC5_RETRY', check: true },
    ]
  }, //WA_POC5
  {
    code: 'WA_POC5_RETRY',
    outChannel: 'WHATSAPP',
    outMessage:`The response you sent is invalid. Please specify the Year of Manufacture of the Vehicle. ` +
      `Please respond with the year in YYYY format (i.e. 2020, 2021).`,
    responses: [
      { nextCode:'WA_POC6', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">": [{"castToNum": {"var": "incMessage"}}, 1900]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, new Date().getYear() + 1900]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WA_POC5_RETRY', check: true },
    ]
  }, //WA_POC5_RETRY
  {
    code: 'WA_POC6',
    outChannel: 'WHATSAPP',
    outMessage:{
      type: "text",
      text: {
	body:`What is the estimated market value of the vehicle? Please enter with the full vehicle value (i.e. 500000).`,
      }
    },
    responses: [
      { nextCode:'WA_POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'WA_POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'WA_POC6_RETRY2', check: true},
    ]
  }, //WA_POC6
  {
    code: 'WA_POC6_RETRY1',
    outChannel: 'WHATSAPP',
    outMessage:`Please enter the value of the car in full. For example, 500000 instead of 500.`,
    responses: [
      { nextCode:'WA_POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'WA_POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WA_POC6_RETRY2', check: true},
    ]
  }, //WA_POC6_RETRY1
  {
    code: 'WA_POC6_RETRY2',
    outChannel: 'WHATSAPP',
    outMessage:`Please enter the amount as a number only. You can type it again here. For example: 50000.`,
    responses: [
      { nextCode:'WA_POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	logbook_loan_options: {"calcLogbookLoanOptions": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]}
      }},
      { nextCode:'WA_POC6_RETRY1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WA_POC6_RETRY2', check: true},
    ]
  }, //WA_POC6_RETRY2
  {
    code: 'WA_POC7',
    outChannel: 'WHATSAPP',
    outMessage:{
      type: "text",
      text: {
	body:`Congratulations {{ first_name }}, you may be prequalified for {{ logbook_loan_options_num_loans }} logbook loans of the amount {{ initial_loan_amount }}, ` +
	  `with a starting monthly payment of {{ logbook_loan_options_min_loan_payment }}. `+
	  `A Money254 agent will call you shortly from number 0746514628 to guide you through a tailored comparison of loan options. ` +
	  `You can also view your personalized loan results on our website by clicking on this link:` + 
	  `money254.info/logbook`,
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true},
    ]
  }, //WA_POC7

];

module.exports={
  pocBotConfig: pocBotConfig,
  jsonLogic: jsonLogic
};
//{"type": "template", "template": { "name": "hello_world", "language": { "code": "en_US" } }}
/*
  "type": "interactive",
  "interactive": {
    "type": "cta_url",
    "header": {
      "type": "text",
      "text": "Some Header"
    },
    "body": {
      "text": "Some Text"
    },
    "footer": {
      "text": "Some Footer"
    },
    "action": {
      "name": "cta_url",
      "parameters": {
        "display_text": "<BUTTON_TEXT>",
        "url": "https://money254.co.ke"
      }
    }
  }*/
/**/
