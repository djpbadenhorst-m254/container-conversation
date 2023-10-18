const test_01 = async () => {
  console.log('here')
};

describe('test', function() {  
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
  });

  it('test: Test', test_01);
});

