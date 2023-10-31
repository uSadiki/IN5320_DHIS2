// This script holds helper function for both CorrectData and DataManagement
// It holds the mutation query used by both scripts for and methods for updating each CoCatOption for choosen commodity
import { useDataMutation } from '@dhis2/app-runtime';
import * as CommonUtils from '../CommonUtils';

//MutationQuery
const dataMutationQuery = {
  resource: 'dataValueSets',
  type: 'create',
  dataSet: 'ULowA8V3ucd',
  data: ({ value, dataElement, period, orgUnit, categoryOptionCombo }) => ({
    dataValues: [
      {
        dataElement: dataElement,
        period: period,
        orgUnit: orgUnit,
        value: value,
        categoryOptionCombo: categoryOptionCombo
      },
    ],
  }),
};

const TransactionsQuery = {
  resource: '/dataStore/IN5320-<18>/Transactions',
  type: 'update',
  data: transactions => transactions,
};


const RecipientsQuery = {
  resource: '/dataStore/IN5320-<18>/Recipients',
  type: 'update',
  data: Recipients => Recipients,
};

const datastoreQuery2 = {
  resource: '/dataStore/IN5320-<18>/Recounts',
  type: 'update',
  data: transactions => transactions,

};

//Main method holder
export const useMutation = () => {
  const [mutate] = useDataMutation(dataMutationQuery);


  const [datastore] = useDataMutation(TransactionsQuery);

  const [mutateRecipients] = useDataMutation(RecipientsQuery);



  const [datastore2] = useDataMutation(datastoreQuery2);


  //Id for different categories
  const endBalanceCategory = "J2Qf1jtZuj8";
  const consumptionCategory = "rQLFnNXXIL0";
  const administeredCategory = "HllvX50cXC0";
  const QTBOCategory = "KPP63zJPkOu";


  //Mutate end balance
  const updateEndBalance = (item, orgUnit) => {
        mutate({
          value: item.endBalance,
          dataElement: item.id,
          period: CommonUtils.getFormattedDate(),
          orgUnit,
          categoryOptionCombo: endBalanceCategory,
      });
    
  };

  //Mutate Quantity To Be Ordered
  const updateQuantityToBeOrdered= (item, orgUnit) => {
        mutate({
            value: item.quantityToBeOrdered,
            dataElement: item.id,
            period: CommonUtils.getFormattedDate(),
            orgUnit,
            categoryOptionCombo: QTBOCategory,
        });

     };

  //Mutate Consumption
  const updateConsumption = (item, orgUnit) => {
        mutate({
            value: item.consumption,
            dataElement: item.id,
            period: CommonUtils.getFormattedDate(),
            orgUnit,
            categoryOptionCombo: consumptionCategory,
      });
    
  };

  //Mutate Administered
  const updateAdministered = (item, orgUnit) => {
      mutate({
          value: item.administered,
          dataElement: item.id,
          period: CommonUtils.getFormattedDate(),
          orgUnit,
          categoryOptionCombo: administeredCategory,
    });
  
};

const pushTransaction = (transactions) => {
  datastore(transactions);
};


const pushRecipients = (Recipients) => {
  mutateRecipients(Recipients);
};


const createTransaction2 = (transactions) => {
  datastore2(transactions);
};




  //Export methods

  return { updateEndBalance, updateConsumption ,updateAdministered,updateQuantityToBeOrdered, pushTransaction, pushRecipients,createTransaction2};


};