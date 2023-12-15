let checkoffLoanAmount = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT',
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
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT
  {
    code: 'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`A {{ product_category }} has a minimum loan amount of 5000.\n` +
	`Please enter an amount greater than 5000.\n` +
	`Or type 0 to go back to the start and choose a different loan type.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR1
  {
    code: 'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR2',
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
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}, store: {initial_loan_amount: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 5000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_LOAN_AMOUNT_ERROR2
]; // hard
let checkoffEmploymentType = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `Are you formally employed?`
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
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {employment_status:'Employed'}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE
  {
    code: 'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE_ERROR1',
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
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {employment_status:'Employed'}},
      
      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_EMPLOYMENT_TYPE_ERROR1
]; // hard
let checkoffEmploymentSector = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `What sector is your current employer in?`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Public Sector" },
		{ id:"2", title: "Private Sector" },
		{ id:"3", title: "Not employed" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_ORGANIZATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {
	employment_sector: "Public Sector"
      }},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR
  {
    code: 'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "interactive",
      interactive:{
	type: "list",
	body: {
	  text: `I'm sorry, I didn't understand your response.\n` + 
	  `Please click on one of the buttons below to let me know what sector your current employer is in.`
	},
	action: {
	  button: "Select an option",
	  sections:[
	    {
              title:"Available options",
              rows: [
		{ id:"1", title: "Public Sector" },
		{ id:"2", title: "Private Sector" },
		{ id:"3", title: "Not employed" },
              ]
	    },
	  ]
	}
      } 
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_ORGANIZATION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 1]},
      ]}, store: {
	employment_sector: "Public Sector"
      }},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 2]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},

      { nextCode:'WAP/FINQUAL/LOGBOOK_VEHICLE_OWNERSHIP', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/SME_EMPLOYMENT_TYPE', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/CONFIRM_CHANNEL_TRANSITION', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"!=": [{"var": "failed_sme"}, true]},
	{"!=": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},
      { nextCode:'WAP/FINQUAL/DOES_NOT_QUALIFY', check: {'and': [
	{"isNum": {"var": "incMessage"}},
	{"==": [{"castToNum": {"var": "incMessage"}}, 3]},
	{"==": [{"var": "failed_sme"}, true]},
	{"==": [{"var": "failed_logbook"}, true]},
      ]}, store: {failed_checkoff: true}},

      { nextCode:'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR_ERROR1', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_EMPLOYMENT_SECTOR_ERROR1
]; // hard
let checkoffEmploymentOrganization = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_EMPLOYMENT_ORGANIZATION',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is the name of the public sector ministry you work within? Please respond with the full name of the ministry.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY', check: true , store: {
	employment_organization: {"var": "incMessage"}
      }},
    ]
  }, // WAP/FINQUAL/CHECKOFF_EMPLOYMENT_ORGANIZATION
];
let checkoffGrossSalary = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_GROSS_SALARY',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`What is your current gross monthly salary?\n` + 
	  `Please enter the full value including all 0s. For example, "500000".`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}, store: {gross_salary: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_GROSS_SALARY
  {
    code: 'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the full value of your gross salary, including all 0s. For example, if your gross salary is 50k, write 50000.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}, store: {gross_salary: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR1
  {
    code: 'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR2',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter your current gross salary using numbers only. For example, "50000"`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{">=": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}, store: {gross_salary: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR1', check: { "and": [
	{"isNum": {"var": "incMessage"}},
	{"<": [{"castToNum": {"var": "incMessage"}}, 1000]},
      ]}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR2', check: true },
    ]
  }, // WAP/FINQUAL/CHECKOFF_GROSS_SALARY_ERROR2
];
let checkoffSalaryDeductions = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Approximately much money is automatically deducted from your paycheck each month to pay off existing checkoff or salary loans?\n` + 
	  `Please enter the full value including all 0s. For example, "20000".\n` + 
	  `Reply with "0" if you do not have any loan payments automatically deducted.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOCATION', check: { "and": [
	{"isNum": {"var": "incMessage"}},
      ]}, store: {salary_deductions: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS
  {
    code: 'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS_ERROR1',
    incChannel: 'WHATSAPP',
    outChannel: 'WHATSAPP',
    outMessage: {
      type: "text",
      text: {
	body:`Please enter the amount deducted from your paycheck for existing loans each month using numbers only.\n` +
	  `For example, "50000".\n` + 
	  `Reply with "0" if you do not have any loan payments automatically deducted.`
      },
    },
    responses: [
      { nextCode:'WAP/FINQUAL/CHECKOFF_LOCATION', check: { "and": [
	{"isNum": {"var": "incMessage"}},
      ]}, store: {salary_deductions: {"castToNum": {"var": "incMessage"}}}},
      { nextCode:'WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS_ERROR1', check: true },
    ],
  }, // WAP/FINQUAL/CHECKOFF_SALARY_DEDUCTIONS_ERROR1
];
let checkoffLocation = [
  {
    code: 'WAP/FINQUAL/CHECKOFF_LOCATION',
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
	applying_for: 'Checkoff Loan',
	location: {"var": "incMessage"},
      	mag_score: {calcMagScore: [
	  {"keyValPair": ["applying_for", "Checkoff Loan"]},
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
	]},
      }},
    ]
  }, // WAP/FINQUAL/CHECKOFF_LOCATION
];

module.exports={
  checkoffLoanChannel: [
    ...checkoffLoanAmount,
    ...checkoffEmploymentType,
    ...checkoffEmploymentSector,
    ...checkoffEmploymentOrganization,
    ...checkoffGrossSalary,
    ...checkoffSalaryDeductions,
    ...checkoffLocation,
  ]
};
