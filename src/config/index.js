//const knex = require('./knex.js');
//const queries = require('./queries.js');
//
//module.exports={
//  ...knex,
//  ...queries
//};

let botConfig = [{
  code: 'INIT',
  channel: 'SMS',
  description: '',
  responses: [
    { nextCode:'Code1', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code2', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code3', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code4', check: {
      condition_type: "Else"
    }}
  ]
},{
  code: 'CODE1',
  description: '',
  responses: [
    { nextCode:'Code1', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code2', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code3', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code4', check: {
      condition_type: "Else"
    }}
  ]
},{
  code: 'CODE2',
  description: '',
  responses: [
    { nextCode:'Code1', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code2', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code3', check: {
      condition_type: "Equal", condition_params: {condition_value: "6"}
    }},
    { nextCode:'Code3', check: {
      condition_type: "Custom Function", condition_params: {condition_function: "someFunc", }
    }},
    { nextCode:'Code4', check: {
      condition_type: "Else"
    }}
  ]
}];

module.exports={
  botConfig: botConfig
};
/*
  let customFuncs = [{
  name: 'someCheck',
  parameters: ['message', 'thresh'],
  code: `
if (message == thresh) {
return true;
}
else {
return false;
}
`
}];
*/
