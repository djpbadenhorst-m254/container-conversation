let logbookLoanAmount = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT',
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT
  {
    code: 'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`A {{ product_category }} has a minimum loan amount of 70000.\n` + 
	`Please enter an amount greater than 70000.\n` + 
	`Or type 0 to go back to the start and choose a different loan type.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR1
  {
    code: 'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR2',
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 70000]},
      ]}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_LOAN_AMOUNT_ERROR2
]; // hard
let logbookVehicleOwnership = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Do you own a vehicle?`
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_vehicle:true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I don't understand your answer.\n` + 
	    `Please click on either the *Yes* or *No* button below to tell me if you currently own a vehicle.`
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_vehicle:true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP_ERROR1
]; // hard
let logbookVehicleType = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What type of vehicle do you own?\n`+
	    `Please select an option from the list below.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Private Vehicle"},
		{ id:"2", title: "Commercial Truck"},
		{ id:"3", title: "PSV"},
		{ id:"4", title: "Uber"},
		{ id:"5", title: "Boda Boda"},
		{ id:"6", title: "Tuk Tuk"},
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type:'Private Vehicle'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type:'Commercial Truck'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type:'PSV'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {owned_vehicle_type:'Uber'}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please click on the *Select Vehicle Type* button below and then click on the product you are interested in.` 
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Private Vehicle"},
		{ id:"2", title: "Commercial Truck"},
		{ id:"3", title: "PSV"},
		{ id:"4", title: "Uber"},
		{ id:"5", title: "Boda Boda"},
		{ id:"6", title: "Tuk Tuk"},
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owned_vehicle_type:'Private Vehicle'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: {owned_vehicle_type:'Commercial Truck'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: {owned_vehicle_type:'PSV'}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 4]},
      ]}, store: {owned_vehicle_type:'Uber'}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 5]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 6]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_TYPE_ERROR1
]; // hard
let logbookVehicleModel = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is the make and model of your vehicle? For example, "Toyota Fielder".`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR', check: true, store: {owned_vehicle_model: {"var": "incMessage"}} },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_MODEL
]; 
let logbookVehicleYear = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is the Year of Manufacture of your {{owned_vehicle_model}}?\n` + 
	  `Please respond with the year in YYYY format (i.e. 2020, 2021)`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 999]},
      ]}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`I'm sorry, I don't understand your response.\n` + 
	  `Please enter a valid Year of Manufacture in YYYY format (i.e. 2020).`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 9999]},
      ]}, store: {owned_vehicle_year: {"castToNum": {"var": "incMessage"}}}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<=": [{"castToNum": {"var": "incMessage"}}, 999]},
      ]}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 2000]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_YEAR_ERROR1
]; // hard
let logbookVehicleLogbook = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Is the logbook currently in your name?`
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_logbook:true}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Please click on either the *Yes* or *No* button below to tell me if the logbook is currently in your name.`
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
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {owns_logbook:true}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_checkoff"}, true]},
      ]}, store: {failed_logbook: true}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_LOGBOOK_ERROR1
]; // hard
let logbookVehicleInsurance = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What kind of insurance does the vehicle currently have?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Comprehensive" },
		{ id:"2", title: "Third Party" },
		{ id:"3", title: "None" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: { owned_vehicle_insurance_type: "Comprehensive"}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: { owned_vehicle_insurance_type: "Third Party"}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: { owned_vehicle_insurance_type: "None"}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	    `Please click on one of the buttons below to let me know what type of insurance is currently on the vehicle.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Comprehensive" },
		{ id:"2", title: "Third Party" },
		{ id:"3", title: "None" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: { owned_vehicle_insurance_type: "Comprehensive"}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
      ]}, store: { owned_vehicle_insurance_type: "Third Party"}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
      ]}, store: { owned_vehicle_insurance_type: "None"}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_INSURANCE_ERROR1
];
let logbookVehicleValue = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is the estimated current market value of the vehicle?\n` +
	  `Please enter the full vehicle value including all 0s. For example, "700000".`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOCATION', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the full value of the vehicle, including all 0s. For example, if the vehicle is worth 70k, write 700,000.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOCATION', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 100000]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR1
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter your best estimate of the current market value of the vehicle  using numbers only.\n` + 
	  `For example, "70000"`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_LOCATION', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, {"*": [1.67, {"var": "initial_loan_amount"}]}]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, {"*": [1.67, {"var": "initial_loan_amount"}]}]},
      ]}, store: {estimated_owned_vehicle_value: {"castToNum": {"var": "incMessage"}}}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_VALUE_ERROR2
];
let logbookVehicleLocation = [
  {
    code: 'WAP/FINQUAL/LOGBOOK_VEHICLE_LOCATION',
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
	applying_for: 'Logbook Loan',
	location: {"var": "incMessage"},
      	mag_score: {calcMagScore: [
	  {"keyValPair": ["applying_for", "Logbook Loan"]},
	  {"keyValPair": ["consent_given", true]},
	  {"keyValPair": ["phone_number", {"removePhonePrefix": {"var": "phone_number"}}]},
	  {"keyValPair": ["first_name", {"var": "first_name"}]},
	  {"keyValPair": ["last_name", {"var": "last_name"}]},
	  {"keyValPair": ["location", {"var": "incMessage"}]},
	  {"keyValPair": ["loan_product", "Logbook Loan"]},
	  {"keyValPair": ["initial_loan_amount", {"var": "initial_loan_amount"}]},
	  {"keyValPair": ["owns_vehicle", {"var": "owns_vehicle"}]},
	  {"keyValPair": ["owns_logbook", {"var": "owns_logbook"}]},
	  {"keyValPair": ["owned_vehicle_type", {"var": "owned_vehicle_type"}]},
	  {"keyValPair": ["owned_vehicle_year", {"var": "owned_vehicle_year"}]},
	  {"keyValPair": ["owned_vehicle_model", {"var": "owned_vehicle_model"}]},
	  {"keyValPair": ["owned_vehicle_insurance_type", {"var": "owned_vehicle_insurance_type"}]},
	  {"keyValPair": ["estimated_owned_vehicle_value", {"var": "estimated_owned_vehicle_value"}]},
	]},
      }},
    ]
  }, // WAP/FINQUAL/LOGBOOK_VEHICLE_LOCATION
];

module.exports={
  logbookLoanChannel: [
    ...logbookLoanAmount,
    ...logbookVehicleOwnership,
    ...logbookVehicleType,
    ...logbookVehicleModel,
    ...logbookVehicleYear,
    ...logbookVehicleLogbook,
    ...logbookVehicleInsurance,
    ...logbookVehicleValue,
    ...logbookVehicleLocation,
  ]
};
