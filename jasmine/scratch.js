const test_01 = async () => {
  //console.log('here')
};

describe('scratch', function() {  
  beforeAll(()=>{
    process.env['DATAWAREHOUSE_HOST'] = '0.0.0.0';
  });

  it('test_01: Test', test_01);
});

