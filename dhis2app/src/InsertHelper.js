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

  
  