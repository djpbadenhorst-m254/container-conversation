let pocWhatsappBot = [
  {
    code: 'INIT',
    incChannel: 'WHATSAPP',
    responses: [
      { nextCode:'WAP/INTRO1', check: true },
    ]
  }, // INIT
  {
    code: 'WAP/INTRO1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Hello! Thank you for messaging Money254. We are Kenya’s premier loan comparison platform. What are you looking for today?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Logbook Loan" },
		{ id:"2", title: "Unsecured Business Loan" },
		{ id:"3", title: "Personal Loan" },
		{ id:"4", title: "Another Type of Loan" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'WAP/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'WAP/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'WAP/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/INTRO1_E1', check: true},
    ]
  }, // WAP/INTRO1
  {
    code: 'WAP/INTRO1_E1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `We're sorry, we don't understand your response. ` +
	    `Please click on the list below and then click on the option ` +
	    `you would like to search for.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Logbook Loan" },
		{ id:"2", title: "Unsecured Business Loan" },
		{ id:"3", title: "Personal Loan" },
		{ id:"4", title: "Another Type of Loan" },
              ]
	    },
	  ]
	}
      }
    },
    responses: [
      { nextCode:'WAP/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'WAP/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'WAP/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'WAP/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/INTRO1_E1', check: true},
    ]
  }, // WAP/INTRO1_E1
  {
    code: 'WAP/UWC_REDIRECT',
    outChannel: 'CLOSED',
    outMessage: {
      "type": "interactive",
      "interactive": {
	"type": "cta_url",
	"body": {
	  "text": `We are currently working on adding Unsecured Business Working Capital ` +
	    `Loans to our chatbot. You can search for them on our website www.money254.co.ke` +
	    `in the meantime by clicking on the link below.`
	},
	"action": {
	  "name": "cta_url",
	  "parameters": {
            "display_text": "Search via Website",
            "url": "https://www.money254.co.ke/loans/business-loans/business-loans-home?utm_source=whatsapp&utm_medium=message&utm_campaign=searchbot"
	  }
	}
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // WAP/UWC_REDIRECT
  {
    code: 'WAP/PL_REDIRECT',
    outChannel: 'WHATSAPP',
    outMessage: {
      "type": "interactive",
      "interactive": {
	"type": "cta_url",
	"body": {
	  "text": `We are currently working on adding Unsecured Business Working Capital ` +
	    `Loans to our chatbot. You can search for them on our website ` +
	    `www.money254.co.ke in the meantime by clicking on the link below.`
	},
	"action": {
	  "name": "cta_url",
	  "parameters": {
            "display_text": "Search via Website",
            "url": "https://www.money254.co.ke/loans/personal-loans/personal-loans-home?utm_source=whatsapp&utm_medium=message&utm_campaign=searchbot"
	  }
	}
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // WAP/PL_REDIRECT
  {
    code: 'WAP/OL_REDIRECT',
    outChannel: 'WHATSAPP',
    outMessage: {
      "type": "interactive",
      "interactive": {
	"type": "cta_url",
	"body": {
	  "text": `We are currently working on adding other loan types to our chatbot. ` +
	    `You can search across all 250 of the loans in our network on our website ` +
	    `in the meantime: www.money254.co.ke`
	},
	"action": {
	  "name": "cta_url",
	  "parameters": {
            "display_text": "Go to Website",
            "url": "https://www.money254.co.ke/loans/personal-loans/personal-loans-home?utm_source=whatsapp&utm_medium=message&utm_campaign=searchbot"
	  }
	}
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // WAP/OL_REDIRECT
  {
    code: 'WAP/INTRO2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Great, we'll search for a Logbook Loan. Before we get started, what is your name? Please respond with your full name only.\n\n` +
	  `Type 0 to go back to the start and choose a different loan.`
      }
    },
    responses: [
      { nextCode:'WAP/LBL1', outChannel: 'WHATSAPP', check: true , store: {
	first_name: {"extractFirstName": {"var": "incMessage"}},
	last_name: {"extractLastName": {"var": "incMessage"}}
      }},
    ]
  }, // WAP/INTRO2
  {
    code: 'WAP/LBL1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Thanks, {{ first_name }}. We can help you compare your logbook loan options over our chat. First, how much financing are you looking for?`
      }
    },
    responses: [
      { nextCode:'WAP/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WAP/LBL1_E1', check: true },
    ]
  }, // WAP/LBL1
  {
    code: 'WAP/LBL1_E1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the loan amount you are requesting using a number only.\n\n` +
	  `Or type 0 to go back to the start.`
      }
    },
    responses: [
      { nextCode:'WAP/INTRO1_RESTART', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'WAP/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WAP/LBL1_E1', check: true },
    ]
  }, // WAP/LBL1_E1
  {
    code: 'WAP/LBL1_E2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Logbook Loans have a minimum loan amount of 50,000. ` +
	  `Please enter an amount greater than 50,000.\n` +
	  `Or type 0 to go back to the start and choose a different loan.`
      }
    },
    responses: [
      { nextCode:'WAP/INTRO1_RESTART', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'WAP/LBL2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/LBL1_E2', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 50000]},
      ]}},
      { nextCode:'WAP/LBL1_E1', check: true },
    ]
  }, // WAP/LBL1_E2
  {
    code: 'WAP/LBL2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Okay, we'll search for Ksh{{ inital_loan_amount }}. We now have some questions to identify which loans you qualify for. First, what type of vehicle do you own?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Private Vehicle" },
		{ id:"2", title: "Commercial Truck" },
		{ id:"3", title: "PSV or Uber" },
		{ id:"4", title: "Boda Boda or Tuk Tuk" },
		{ id:"5", title: "I do not currently own a Vehicle" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type:"Private Vehicle"}},
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type:"Commercial Truck"}},
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type:"PSV or Uber"}},
      { nextCode:'WAP/LBL2_DNQ2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/LBL2_DNQ1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
      ]}},
      { nextCode:'WAP/LBL2_E1', check: true},
    ]
  }, // WAP/LBL2
  {
    code: 'WAP/LBL2_E1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `We're sorry, we don't understand your response. ` +
	    `Please click on the list below and then click on the option ` +
	    `you would like to search for.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Private Car" },
		{ id:"2", title: "Commercial Truck" },
		{ id:"3", title: "PSV or Uber" },
		{ id:"4", title: "Boda Boda or Tuk Tuk" },
		{ id:"5", title: "I do not currently own a Vehicle" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type:"Private Vehicle"}},
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type:"Commercial Truck"}},
      { nextCode:'WAP/LBL3', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type:"PSV or Uber"}},
      { nextCode:'WAP/LBL2_DNQ2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/LBL2_DNQ1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
      ]}},
      { nextCode:'WAP/LBL2_E1', check: true},
    ]
  }, // WAP/LBL_E1
  {
    code: 'WAP/LBL2_DNQ1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      "type": "interactive",
      "interactive": {
	"type": "cta_url",
	"body": {
	  "text": `Unfortunately you need to own a vehicle to qualify for a logbook loan. You can browse other loan types on our website here:`
	},
	"action": {
	  "name": "cta_url",
	  "parameters": {
            "display_text": "Money254",
            "url": "https://money254.info/allloans"
	  }
	}
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // WAP/LBL2_DNQ1
  {
    code: 'WAP/LBL2_DNQ2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      "type": "interactive",
      "interactive": {
	"type": "cta_url",
	"body": {
	  "text": `Unfortunately we currently only offer logbook loans for motor four wheeled vehicles. You can browse other loan types on our website here:`
	},
	"action": {
	  "name": "cta_url",
	  "parameters": {
            "display_text": "Money254",
            "url": "https://money254.info/allloans"
	  }
	}
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true },
    ]
  }, // WAP/LBL2_DNQ2
  {
    code: 'WAP/LBL3',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What is the Year of Manufacture of the Vehicle?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"2023", title: "2023" },
		{ id:"2022", title: "2022" },
		{ id:"2021", title: "2021" },
		{ id:"2020", title: "2020" },
		{ id:"2019", title: "2019" },
		{ id:"2018", title: "2018" },
		{ id:"2017", title: "2017" },
		{ id:"2016", title: "2016" },
		{ id:"2015", title: "2015" },
		{ id:"2014", title: "2014" },
		{ id:"2012", title: "2012" },
		{ id:"2011", title: "2011" },
		{ id:"2010", title: "201" },
		{ id:"2009", title: "2009" },
		{ id:"2008", title: "2008" },
		{ id:"2007", title: "2007" },
		{ id:"2006", title: "2006" },
		{ id:"2005", title: "2005" },
		{ id:"Older than 2005", title: "2004" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/LBL4', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/LBL3_E1', check: true },
    ]
  }, // WAP/LBL3
  {
    code: 'WAP/LBL3_E1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `We're sorry, we don't understand your response. ` +
	    `Please click on the list below and then click on the option ` +
	    `you would like to search for.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"2023", title: "2023" },
		{ id:"2022", title: "2022" },
		{ id:"2021", title: "2021" },
		{ id:"2020", title: "2020" },
		{ id:"2019", title: "2019" },
		{ id:"2018", title: "2018" },
		{ id:"2017", title: "2017" },
		{ id:"2016", title: "2016" },
		{ id:"2015", title: "2015" },
		{ id:"2014", title: "2014" },
		{ id:"2012", title: "2012" },
		{ id:"2011", title: "2011" },
		{ id:"2010", title: "201" },
		{ id:"2009", title: "2009" },
		{ id:"2008", title: "2008" },
		{ id:"2007", title: "2007" },
		{ id:"2006", title: "2006" },
		{ id:"2005", title: "2005" },
		{ id:"Older than 2005", title: "Older than 2005" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/LBL4', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/LBL3_E1', check: true },
    ]
  }, // WAP/LBL3_E1
  {
    code: 'WAP/LBL4',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is the estimated market value of the vehicle? Please enter with the full vehicle value (i.e. 700000).`
      }
    },
    responses: [
      { nextCode:'WAP/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'WAP/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'WAP/LBL4_E2', check: true },
    ]
  }, // WAP/LBL4
  {
    code: 'WAP/LBL4_E1',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the full value of the vehicle, including all 0s. For example, if the vehicle is worth 70k, write 700,000.`
      }
    },
    responses: [
      { nextCode:'WAP/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'WAP/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'WAP/LBL4_E2', check: true },
    ]
  }, // WAP/LBL4_E1
  {
    code: 'WAP/LBL4_E2',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`This response is invalid. Please enter the full value of the vehicle (i.e. 700000).\n\n` +
	  `Or type 0 to go back to the start.`
      }
    },
    responses: [
      { nextCode:'WAP/INTRO1_RESTART', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 0]},
      ]}},
      { nextCode:'WAP/LBL_RESULTS_PASS', check: { "and": [
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
      { nextCode:'WAP/LBL4_E1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}},
      { nextCode:'WAP/LBL4_E2', check: true },
    ]
  }, // WAP/LBL4_E2
  {
    code: 'WAP/LBL_RESULTS_PASS',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Congratulations {{ first_name }}, we've found {{ logbook_loan_options_num_loans }} different logbook loans you may qualify for!\n\n` +
	  `Your Results:\n` + 
	  `* Options available from {{ logbook_loan_options_num_loans }} Lenders\n` + 
	  `* Starting monthly payment from Ksh{{ logbook_loan_options_min_loan_payment }}\n\n` + 
	  `A Money254 agent will call you shortly from number 0746514628 to guide you through a tailored comparison of these loan options. ` +
	  `You can browse options while you wait here: money254.info/logbook`
      }
    },
    responses: [
      { nextCode:'CLOSED', check: true},
    ]
  }, // WAP/LBL_RESULTS_PASS
  
  {
    code: 'WAP/INTRO1_RETURN',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Welcome back {{ first_name }}. What type of loan can we help you search for today?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Logbook Loan" },
		{ id:"2", title: "Unsecured Business Loan" },
		{ id:"3", title: "Personal Loan" },
		{ id:"4", title: "Another Type of Loan" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'WAP/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'WAP/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'WAP/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/INTRO1_E1', check: true},
    ]
  }, // WAP/INTRO1_RETURN
  {
    code: 'WAP/INTRO1_RESTART',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Okay {{ first_name }}, lets look for a different type of loan. What type of loan would you like to search for?\n`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Logbook Loan" },
		{ id:"2", title: "Unsecured Business Loan" },
		{ id:"3", title: "Personal Loan" },
		{ id:"4", title: "Another Type of Loan" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/INTRO2', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}},
      { nextCode:'WAP/UWC_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}},
      { nextCode:'WAP/PL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}},
      { nextCode:'WAP/OL_REDIRECT', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}},
      { nextCode:'WAP/INTRO1_E1', check: true},
    ]
  }, // WAP/INTRO1_RESTART
];

module.exports={
  pocWhatsappBot: pocWhatsappBot,
};


let TEST = {
  code: 'POC4',
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
	]
      }
    }
  },
  responses: [
    { nextCode:'TEST', check: true},
  ]
};
