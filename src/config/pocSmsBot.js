let pocSmsBot = [
  {
    code: 'INIT',
    incChannel: 'SMS',
    responses: [
      { nextCode:'SMS/INTRO1_PRE', check: { '==': [{'lower': {'trim': {'var': 'incMessage'}}}, 'hi'] }},
      { nextCode:'CLOSED', check: true },
    ]
  }, // INIT
  {
    code: 'SMS/INTRO1_PRE',
    incChannel: 'SMS',
    outMessage: `Hello! Thank you for messaging Money254. ` +
      `We are Kenya’s premier loan comparison platform!\n` + 
      `Our search is better on WhatsApp. ` +
      `Click this link to unlock full features and continue chatting with us on WhatsApp: ` + 
      `money254.info/whatsapp\n\n` + 
      `If you do not have WhatsApp, please respond with the number 0 to continue on SMS.`,
    responses: [
      { nextCode:'SMS/INTRO1', check: true },
    ]
  }, // SMS/INTRO1_PRE
  {
    code: 'SMS/INTRO1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Okay, we can continue on SMS. What are you looking for today?\n` + 
      `1 - Logbook Loan\n` + 
      `2 - Business Unsecured Working Capital Loan\n` + 
      `3 - Personal Loan\n` + 
      `4 - Another Type of Loan\n` + 
      `Please respond with the number only.\n\n` + 
      `Remember that you can unlock our full search features by chatting with us on ` +
      `WhatsApp here: money254.info/whatsapp`,
    responses: [
      { nextCode:'SMS/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'SMS/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'SMS/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'SMS/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'SMS/INTRO1_E1', check: true},
    ]
  }, // SMS/INTRO1
  {
    code: 'SMS/INTRO1_E1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Please respond with the option you are looking for using the number only (i.e. 1)` + 
      `1 - Logbook Loan\n` + 
      `2 - Business Unsecured Working Capital Loan\n` + 
      `3 - Personal Loan\n` + 
      `4 - Another Type of Loan`,
    responses: [
      { nextCode:'SMS/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'SMS/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'SMS/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'SMS/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'SMS/INTRO1_E1', check: true},
    ]
  }, // SMS/INTRO1_E1
  {
    code: 'SMS/UWC_REDIRECT',
    outChannel: 'SMS',
    outMessage: `We're sorry, we are currently working on adding Business ` +
      `Unsecured Working Capital Loans to our chatbot. You can search for ` +
      `them on our web in the meantime using this link: money254.info/business.`,
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // SMS/UWC_REDIRECT
  {
    code: 'SMS/PL_REDIRECT',
    outChannel: 'SMS',
    outMessage: `We're sorry, we are currently working on adding Personal Loans to ` +
      `our chatbot. You can search for them on our web in the meantime using this ` +
      `link: money254.info/personal.`,
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // SMS/PL_REDIRECT
  {
    code: 'SMS/OL_REDIRECT',
    outChannel: 'SMS',
    outMessage: `We are still adding other loan types to our chatbot. You can ` +
      `search across all 250 of the loans in our network on our website in the ` +
      `meantime: money254.co.ke`,
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // SMS/OL_REDIRECT
  {
    code: 'SMS/INTRO2',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Great, we'll search for a Logbook Loan. Before we get started, ` +
      `what is your full name? Please respond with your full name only.`,
    responses: [
      { nextCode:'SMS/LBL1', check: true , store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
    ]
  }, // SMS/INTRO2
  {
    code: 'SMS/LBL1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Thanks, {{ first_name }}. We can help you compare your logbook loan ` +
      `options over our chat. First, how much financing are you looking for?`,
    responses: [
      { nextCode:'SMS/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'SMS/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'SMS/LBL1_E1', check: true },
    ]
  }, // SMS/LBL1
  {
    code: 'SMS/LBL1_E1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Please enter the loan amount you are requesting using a number only.\n` + 
      `Or type 0 to go back to the start.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'SMS/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'SMS/LBL1_E1', check: true },
    ]
  }, // SMS/LBL1_E1
  {
    code: 'SMS/LBL1_E2',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Logbook Loans have a minimum loan amount of 50,000. Please enter an ` +
      `amount greater than 50,000. Or type 0 to go back to the start and choose a ` +
      `different loan.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'SMS/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'SMS/LBL1_E1', check: true },
    ]
  }, // SMS/LBL1_E2
  {
    code: 'SMS/LBL2',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`Okay, we'll search for Ksh{{ inital_loan_amount }}. ` +
      `We now have some questions to identify which loans you qualify for. ` +
      `First, what type of vehicle do you own?\n` + 
      `Please reply with a number representing your answer.\n` +
      `1. Private Vehicle\n` +
      `2. Commercial Truck\n` +
      `3. PSV or Uber\n` +
      `4. Boda Boda or Tuk Tuk\n` +
      `5. I do not currently own a Vehicle.`,
    responses: [
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type: "Private Vehicle"}},
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type: "Commercial Truck"}},
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type: "PSV or Uber"}},
      { nextCode:'SMS/LBL2_DNQ2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'SMS/LBL2_DNQ1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
      ]}},
      { nextCode:'SMS/LBL2_E1', check: true},
    ]
  }, // SMS/LBL2
  {
    code: 'SMS/LBL2_E1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`Please respond with the option you are looking for using the number only (i.e. 1)` + 
      `1. Private Car / Truck / SUV\n` + 
      `2. Commercial Truck\n` + 
      `3. PSV or Uber\n` + 
      `4. Boda Boda or Tuk Tuk\n` + 
      `5. I do not currently own a Vehicle.\n\n` + 
      `Or type 0 to go back to the start.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type: "Private Vehicle"}},
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type: "Commercial Truck"}},
      { nextCode:'SMS/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type: "PSV or Uber"}},
      { nextCode:'SMS/LBL2_DNQ2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'SMS/LBL2_DNQ1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
      ]}},
      { nextCode:'SMS/LBL2_E1', check: true},
    ]
  }, // SMS/LBL2_E1
  {
    code: 'SMS/LBL2_DNQ1',
    outChannel: 'SMS',
    outMessage: `Unfortunately you need to own a vehicle to qualify for a logbook loan. You can browse other loan types on our website here: money254.info/allloans`,
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // SMS/LBL2_DNQ1
  {
    code: 'SMS/LBL2_DNQ2',
    outChannel: 'SMS',
    outMessage: `Unfortunately we currently only offer logbook loans for motor four wheeled vehicles. You can browse other loan types on our website here: money254.info/allloans`,
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // SMS/LBL2_DNQ2
  {
    code: 'SMS/LBL3',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`What is the Year of Manufacture of the Vehicle? Please respond with the year in YYYY format (i.e. 2020, 2021)`,
    responses: [
      { nextCode:'SMS/LBL4', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'SMS/LBL3_E1', check: true },
    ]
  }, // SMS/LBL3
  {
    code: 'SMS/LBL3_E1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`This response is invalid. Please enter a valid Year of Manufacture in YYYY format. (i.e. 2020). Enter 0 to go back to the start.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL4', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'SMS/LBL3_E1', check: true },
    ]
  }, // SMS/LBL3_E1
  {
    code: 'SMS/LBL4',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`What is the estimated market value of the vehicle? ` +
      `Please enter with the full vehicle value (i.e. 700000).`,
    responses: [
      { nextCode:'SMS/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'SMS/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'SMS/LBL4_E2', check: true },
    ]
  }, // SMS/LBL4
  {
    code: 'SMS/LBL4_E1',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`Please enter the full value of the vehicle, including all 0s. ` +
      `For example, if the vehicle is worth 70k, write 700,000.\n` + 
      `Or type 0 to go back to the start.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'SMS/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'SMS/LBL4_E2', check: true },
    ]
  }, // SMS/LBL4_E1
  {
    code: 'SMS/LBL4_E2',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage:`This response is invalid. ` +
      `Please enter the full value of the vehicle (i.e. 700000).\n` + 
      `Or type 0 to go back to the start.`,
    responses: [
      { nextCode:'SMS/INTRO1_RESTART', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'SMS/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'SMS/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'SMS/LBL4_E2', check: true },
    ]
  }, // SMS/LBL4_E2
  {
    code: 'SMS/LBL_RESULTS_PASS',
    outChannel: 'SMS',
    outMessage:`Congratulations {{ first_name }}, we've found` +
      `{{ logbook_loan_options_num_loans }} different logbook loans you may qualify for!\n\n` +
      `Your Results:\n` + 
      `* Options available from {{ logbook_loan_options_num_loans }} Lenders\n` + 
      `* Starting monthly payment from Ksh{{ logbook_loan_options_min_loan_payment }}\n\n` + 
      `A Money254 agent will call you shortly from number 0746514628 to guide you ` +
      `through a tailored comparison of these loan options. ` +
      `You can browse options while you wait here: money254.info/logbook`,
    responses: [
      { nextCode:'CLOSED', check: true},
    ]
  }, // SMS/LBL_RESULTS_PASS
  {
    code: 'SMS/INTRO1_RETURN',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Welcome back {{ first_name }}. What type of loan can we help you ` +
      `search for today?\n` +
      `1 - Logbook Loan\n` + 
      `2 - Business Unsecured Working Capital Loan\n` + 
      `3 - Personal Loan\n` + 
      `4 - Another Type of Loan\n` + 
      `Please respond with the number only.\n\n` + 
      `Remember that our search is better on WhatsApp! ` +
      `Click this link to unlock full features and continue chatting with ` +
      `us on WhatsApp: money254.info/whatsapp`,
    responses: [
      { nextCode:'INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'INTRO2_E1', check: true},
    ]
  }, // SMS/INTRO1_RETURN
  {
    code: 'SMS/INTRO1_RESTART',
    incChannel: 'SMS',
    outChannel: 'SMS',
    outMessage: `Okay {first_name}, lets look for a different type of loan. ` +
      `What type of loan would you like to search for?\n` +
      `1 - Logbook Loan\n` + 
      `2 - Business Unsecured Working Capital Loan\n` + 
      `3 - Personal Loan\n` + 
      `4 - Another Type of Loan\n` + 
      `Please respond with the number only.\n\n` + 
      `Remember that our search is better on WhatsApp! ` +
      `Click this link to unlock full features and continue chatting with ` +
      `us on WhatsApp: money254.info/whatsapp`,
    responses: [
      { nextCode:'SMS/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'SMS/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'SMS/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'SMS/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'SMS/INTRO1_E1', check: true},
    ]
  }, // SMS/INTRO1_RESTART
];

module.exports={
  pocSmsBot: pocSmsBot,
};
