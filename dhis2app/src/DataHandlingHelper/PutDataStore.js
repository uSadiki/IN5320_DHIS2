const request = {
    request0: {
      resource: "/dataStore/IN5320-<18>/Recounts",
      type: "Update"
    }
  }

  export const PutData = () => {
    const [mutate] = useDataMutation(dataMutationQuery);
  
    const [datastore] = useDataMutation(request);
  
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
  
  const createTransaction = (transactions) => {
    datastore(transactions);
  };
  
  
  
  
    //Export methods
    return { updateEndBalance, updateConsumption ,updateAdministered,updateQuantityToBeOrdered, createTransaction};
  };

  const sendRequest = () => {
      const { loading, error, data } = useDataMutation(request)
      if (error) {
          return <span>ERROR: {error.message}</span>
      }
  
      if (loading) {
          return <span>Loading...</span>
      }
  
      if (data) {
         console.log("API response:",data)
         //To-do: return a component using the data response 
      }
  }