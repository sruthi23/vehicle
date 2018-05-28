/*
# Copyright IBM Corp. All Rights Reserved.
#
# SPDX-License-Identifier: Apache-2.0
*/

'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

  // The Init method is called when the Smart Contract 'fabcar' is instantiated by the blockchain network
  // Best practice is to have any Ledger initialization in separate function -- see initLedger()
  async Init(stub) {
    console.info('=========== Instantiated fabcar chaincode ===========');
    return shim.success();
  }

  // The Invoke method is called as a result of an application request to run the Smart Contract
  // 'fabcar'. The calling application program has also specified the particular smart contract
  // function to be called, with arguments
  async Invoke(stub) {
    let ret = stub.getFunctionAndParameters();
    console.info(ret);

    let method = this[ret.fcn];
    if (!method) {
      console.error('no function of name:' + ret.fcn + ' found');
      throw new Error('Received unknown function ' + ret.fcn + ' invocation');
    }
    try {
      let payload = await method(stub, ret.params, this);
      return shim.success(payload);
    } catch (err) {
      console.log(err);
      return shim.error(err);
    }
  }

  async queryCar(stub, args) {
    if (args.length != 1) {
      throw new Error('Incorrect number of arguments. Expecting CarNumber ex: CAR01');
    }
    let carNumber = args[0];

    let carAsBytes = await stub.getState(carNumber); //get the car from chaincode state
    if (!carAsBytes || carAsBytes.toString().length <= 0) {
      throw new Error(carNumber + ' does not exist: ');
    }
    console.log(carAsBytes.toString());
    return carAsBytes;
  }

  async initLedger(stub, args) {
    console.info('============= START : Initialize Ledger ===========');
    let cars = [];
    cars.push({
      make: 'Maruti',
      model: 'Dzire',
      chasisno: 'TD23FERTS34DF',
      date: '2527235154' ,
      VIN:'Z4SD23FERTS34DF',
      points:2000,
      //plate:'KL01',
      //Engine:'1.2-litre K Series VVT',
      //color: 'blue',
     // owner: 'Tomoko',
     services:[{"name":"service1","scheduled":1000,"actual":1000,"status":0,"point":500}],
     replacement:{"part1":[{"scheduled":20000,"actual":20000,"status":0,"point":500}]},
     grandpoints :'3000'

   });
    
    for (let i = 0; i < cars.length; i++) {
      cars[i].docType = 'car';
      await stub.putState('CAR' + i, Buffer.from(JSON.stringify(cars[i])));
      console.info('Added <--> ', cars[i]);
    }
    console.info('============= END : Initialize Ledger ===========');
  }

  async createCar(stub, args) {
    console.info('============= START : Create Car ===========', args);

    /*if (args.length != 1) {
      throw new Error('Incorrect number of arguments...................');
    }*/

    var data = JSON.parse(args[0])
    var car = {
      docType: 'car',
      make: data.make,
      model: data.modal,
      chasisno: data.chasisno,
      date: data.date,
      VIN: data.VIN,
      points:data.points,
      //plate: args[5],
      //engine: args[6],
      //owner : args[7],
      //saledate:args[8],
      services:data.serviceSchedule,
      replacement:data.replacement,
      grandpoints : data.gpoints
    };
    console.info('----createCar----'+args[0]);
    await stub.putState(data.VIN, Buffer.from(JSON.stringify(car)));
    console.info('============= END : Create Car ===========');
  }

  async queryAllCars(stub, args) {

    let startKey = 'CAR0';
    let endKey = 'CAR999';

    let iterator = await stub.getStateByRange(startKey, endKey);

    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async changeCarOwner(stub, args) {
    console.info('============= START : changeCarOwner ===========');
    if (args.length != 2) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let carAsBytes = await stub.getState(args[0]);
    let car = JSON.parse(carAsBytes);
    car.owner = args[1];

    await stub.putState(args[0], Buffer.from(JSON.stringify(car)));
    console.info('============= END : changeCarOwner ===========');
  }

  async getResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return allResults;
        
      }
    }
  }

  async getHistoryForCar(stub,args,thisClass) {

    if (args.length < 1) {
      throw new Error('Incorrect number of arguments. Expecting 1')
    }
    let vin = args[0];
    console.info('- start getHistoryCar: %s\n', vin);

    let resultsIterator = await stub.getHistoryForKey(vin);
    let method = thisClass['getResults'];
    let results = await method(resultsIterator, true);

    return Buffer.from(JSON.stringify(results));
  }

  async storeActivity(stub, args){

    if (args.length != 3) {
      throw new Error('Incorrect number of arguments. Expecting 2');
    }

    let indexName = 'VIN';
    let cardata = {};
    cardata.vin = args[0];
    cardata.type = args[1];
    cardata.data = args[2];

    let vinAsIndexKey = await stub.createCompositeKey(indexName,[cardata.vin,cardata.type]);

    await stub.putState(vinAsIndexKey,Buffer.from(JSON.stringify(cardata.data)));

  }

  async getActivity(stub,args,thisClass){

    let vin = args[0];
    //let type = args[1];
    //let iterator = await stub.getStateByPartialCompositeKey('VIN', [type]);
    
    let iterator = await stub.getStateByPartialCompositeKey('VIN', [vin]);
    
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        jsonRes.Key = res.value.key;
        jsonRes.Timestamp = res.value.timestamp;
        try {
          jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          
        } catch (err) {
          console.log(err);
          jsonRes.Record = res.value.value.toString('utf8');
          
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        console.info(allResults);
        return Buffer.from(JSON.stringify(allResults));
      }
    }
  }

  async makePoint(stub,args){


  }
};

shim.start(new Chaincode());
