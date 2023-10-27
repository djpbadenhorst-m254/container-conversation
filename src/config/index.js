const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const _ = require("lodash");

const jsonLogic = require('json-logic-js');
jsonLogic.add_operation('lower', (a)=>a.toLowerCase());
jsonLogic.add_operation('trim', (a)=>a.trim());
jsonLogic.add_operation('isNum', (a)=>!isNaN(a.trim()));
jsonLogic.add_operation('castToNum', (a)=>parseFloat(a.trim()));
jsonLogic.add_operation('extractFirstName', (a)=>a.trim().split(' ')[0]);
jsonLogic.add_operation('extractLastName', (a)=>a.trim().split(' ').splice(1).join(' '));
jsonLogic.add_operation('keyValPair', (a,b)=>[a,b]);
jsonLogic.add_operation('createLoanApplication', (...args)=>{
  let data = args.reduce((a,b)=>({[b[0]]:b[1],...a}),{});

  let request = new XMLHttpRequest();
  request.open('POST', `${process.env['DIRECTUS_URL']}/items/loan_applications`, false);
  request.setRequestHeader("Authorization", `Bearer ${process.env['DIRECTUS_ADMIN_TOKEN']}`);  
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify(data));
  
  let application = JSON.parse(request.responseText);
  return application.data.webscreen_status;
});
jsonLogic.add_operation('calcMinPayment', (initial_loan_amount)=>{
  let request = new XMLHttpRequest();
  request.open('POST', `${process.env['DIRECTUS_URL']}/quotes/calc_min_payment?take_home=${initial_loan_amount}&details=false`, false);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({"filter": {"_and": [{"visible_on_logbook_loans":{"_eq": true}}]}}));

  let resp = JSON.parse(request.responseText);
  return _.min(resp.data.map(x=>x.total_monthly_cost));
});
jsonLogic.add_operation('calcNumLoans', (initial_loan_amount)=>{
  let request = new XMLHttpRequest();
  request.open('POST', `${process.env['DIRECTUS_URL']}/quotes/calc_min_payment?take_home=${initial_loan_amount}&details=false`, false);
  request.setRequestHeader("Content-Type", "application/json");
  request.send(JSON.stringify({"filter": {"_and": [{"visible_on_logbook_loans":{"_eq": true}}]}}));

  let resp = JSON.parse(request.responseText);
  return resp.data.length;
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
    outMessage:`What is the estimated market value of the vehicle? Please enter with the full vehicle value (i.e. 500000).`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	min_payment: {"calcMinPayment": {"var": "initial_loan_amount"}},
	num_qualified_loans: {"calcNumLoans": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"var": "phone_number"}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
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
    outMessage:`Please enter the value of the car in full. For example, 500000 instead of 500.`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	min_payment: {"calcMinPayment": {"var": "initial_loan_amount"}},
	num_qualified_loans: {"calcNumLoans": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"var": "phone_number"}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
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
    outMessage:`Please enter the amount as a number only. You can type it again here. For example: 50000.`,
    responses: [
      { nextCode:'POC7', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {
	estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}},
	min_payment: {"calcMinPayment": {"var": "initial_loan_amount"}},
	num_qualified_loans: {"calcNumLoans": {"var": "initial_loan_amount"}},
	webscreen_status: {"createLoanApplication": [
	  {"keyValPair": ["phone_number", {"var": "phone_number"}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
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
    outMessage:`Congratulations {{ first_name }}, you may be prequalified for {{ num_qualified_loans }} logbook loans of the amount {{ initial_loan_amount }}, ` +
      `with a starting monthly payment of {{ min_payment }}. `+
      `A Money254 agent will call you shortly from number 0746514628 to guide you through a tailored comparison of loan options. ` +
      `You can also view your personalized loan results on our website by clicking on this link:` + 
      `money254.info/logbook`,
    responses: [
      { nextCode:'CLOSED', check: true},
    ]
  }, //POC7
];

module.exports={
  pocBotConfig: pocBotConfig,
  jsonLogic: jsonLogic
};
