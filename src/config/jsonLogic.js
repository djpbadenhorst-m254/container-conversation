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

module.exports={
  jsonLogic: jsonLogic
};
