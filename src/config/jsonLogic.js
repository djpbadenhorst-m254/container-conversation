const syncFetch = require('sync-fetch');
const _ = require("lodash");

const jsonLogic = require('json-logic-js');
jsonLogic.add_operation('lower', (a)=>a.toLowerCase());
jsonLogic.add_operation('trim', (a)=>a.trim());
jsonLogic.add_operation('isNum', (a)=>!isNaN(parseFloat(a.replace(/\D/g,''))));
jsonLogic.add_operation('castToNum', (a)=>parseFloat(a.replace(/\D/g,'')));
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

jsonLogic.add_operation('calcMagScore', (...args)=>{
  let data = args.reduce((a,b)=>({[b[0]]:b[1],...a}),{});
  let magScore = 0;

  magScore = magScore + Math.min(data.initial_loan_amount/1000000*40,40);

  if (['nairobi','kiambu'].includes(data.location?.toLowerCase()))
    magScore = magScore + 10;
  
  if (['kisumu','mombasa', 'nyeri'].includes(data.location?.toLowerCase()))
    magScore = magScore + 5;

  if (data.applying_for == 'Logbook Loan') {
    if (data.owned_vehicle_year>=2000 && data.owned_vehicle_year<=2015)
      magScore = magScore + 10;
    if (data.owned_vehicle_year>=2016 && data.owned_vehicle_year<=2018)
      magScore = magScore + 5;
    
    if (['comprehensive'].includes(data.owned_vehicle_insurance_type?.toLowerCase()))
      magScore = magScore + 10;
    
    if (data.estimated_owned_vehicle_value > data.initial_loan_amount)
      magScore = magScore + Math.min(data.estimated_owned_vehicle_value/(1.67*data.initial_loan_amount)*30,30);
  }

  if (data.applying_for == 'Checkoff Loan') {
    if (data.gross_salary<30000) {
      magScore = magScore + 0;
    } else if (data.gross_salary<50000) {
      magScore = magScore + 10;
    } else if (data.gross_salary<80000) {
      magScore = magScore + 15;
    } else if (data.gross_salary>=80000) {
      magScore = magScore + 20;
    }

    if (data.salary_deductions > 0.37*data.gross_salary) {
      magScore = magScore + 0;
    } else if (data.salary_deductions > 0.3*data.gross_salary) {
      magScore = magScore + 5;
    } else if (data.salary_deductions > 0.2*data.gross_salary) {
      magScore = magScore + 10;
    } else if (data.salary_deductions > 0.1*data.gross_salary) {
      magScore = magScore + 20;
    } else if (data.salary_deductions > 0) {
      magScore = magScore + 30;
    }
  }
  
  if (data.applying_for == 'SME Loan') {
    if (['registered'].includes(data.sme_business_registration?.toLowerCase()))
      magScore = magScore + 10;
    if (['county permit','trading license'].includes(data.sme_business_registration?.toLowerCase()))
      magScore = magScore + 5;
    
    if (data.sme_business_income<20000) {
      magScore = magScore + 0;
    } else if (data.sme_business_income<50000) {
      magScore = magScore + 5;
    } else if (data.sme_business_income<100000) {
      magScore = magScore + 10;
    } else if (data.sme_business_income<200000) {
      magScore = magScore + 20;
    } else if (data.sme_business_income>=200000) {
      magScore = magScore + 30;
    }

    if (data.sme_guarantor == true)
      magScore = magScore + 10;
  }  
  
  return Math.round(magScore);
});
jsonLogic.add_operation('finqualApiCall', (...args)=>{
  let data = args.reduce((a,b)=>({[b[0]]:b[1],...a}),{});
  let url = 'https://m254-maverick-stg-directus-ndfhdd4obq-ew.a.run.app/finqual/apply';
  let application = syncFetch( url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer 1bb822a6-8b75-11ed-9f51-3bad9be27fcd`,
    }
  }).json();
  return application.data?.webscreen_status;
});

module.exports={
  jsonLogic: jsonLogic
};
