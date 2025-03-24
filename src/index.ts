import { processTemplate } from "./process";

function simpleExample() {
  const simpleProcessObject = {
    cardNumber: "%cardNumber",
    name: "%customerName",
    accounutType: "?accountType",
  };

  const simpleExampleRequest = {
    cardNumber: "1234567890",
    customerName: "Bob",
  };

  const data = processTemplate(simpleProcessObject, simpleExampleRequest);
  console.log(data);
}

function complexExample() {
  // Complex example
  const complexTemplate = {
    blacklist: [
      {
        addressInfo: [
          {
            zipCode: "%zipCode",
            addressLine1: "%addressLine1",
            addressLine2: "?addressLine2",
            stateCode: "%stateCode",
            city: "%city",
          },
        ],
        type: "?blacklistType",
      },
    ],
    createUser: "%userId",
  };

  const complexInput = {
    zipCode: "12345",
    addressLine1: "123 Main St",
    stateCode: "CA",
    city: "San Francisco",
    userId: "DEV1234",
    blacklistType: "ADDRESS",
  };

  const complexResult = processTemplate(complexTemplate, complexInput);

  console.log(JSON.stringify(complexResult, null, 2));
}

simpleExample();

complexExample();
