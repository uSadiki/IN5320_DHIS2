import React from 'react'
import {
    ReactFinalForm,
    InputFieldFF,
    Button,
    SingleSelectFieldFF,
    hasValue,
    number,
    composeValidators,
} from '@dhis2/ui'

import { useDataMutation } from '@dhis2/app-runtime'
import { useDataQuery } from '@dhis2/app-runtime'

const dataQuery = {
  dataValues: {
    resource: "/dataValueSets",
    params: {
    //todo make a option to choose orgunit and period
      orgUnit: "plnHVbJR6p4",
      period: "202209",
      dataSet: "ULowA8V3ucd",
    },
  },
  dataElements: {
    resource: "/dataElements",
    params: {
      fields: ["id", "displayName"],
      //all Commodities starts with Commodities, filter after that
      filter: "displayName:like:Commodities",
    },
  },
};

function mergeData(data) {
    let mergedData = data.dataElements.dataElements.map(d => {
        let matchedValue = data.dataValues.dataValues.find(dataValue => {
            return dataValue.dataElement == d.id;
        })

        return {
            displayName: d.displayName,
            id: d.id,
            value: matchedValue.value,
        }
    })
    return mergedData
}


const dataMutationQuery = {
    resource: 'dataValueSets',
    type: 'create',
    dataSet: 'ULowA8V3ucd',
    data: ({ value, dataElement, period, orgUnit }) => ({
        dataValues: [
            {
                dataElement: dataElement,
                period: period,
                orgUnit: orgUnit,
                value: value,
            },
        ],
    }),
}

export function Insert(props) {
    const [mutate, { loading, error }] = useDataMutation(dataMutationQuery)
    const { data } = useDataQuery(dataQuery)

    function onSubmit(formInput) {
        if (data) {
            let mergedData = mergeData(data);
            
            const originalValue = mergedData.find(commoditie => commoditie.id === formInput.dataElement).value || 0;
            const newValue = originalValue - formInput.value;

            console.log(formInput)
            mutate({
                value: newValue,
                dataElement: formInput.dataElement,
                period: '202209',
                orgUnit: 'plnHVbJR6p4',
            })
        }
    }

    if(data){
        let mergedData = mergeData(data)
        
        return (
            <div>
                <ReactFinalForm.Form onSubmit={onSubmit}>
                    {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} autoComplete="off">
                            <ReactFinalForm.Field
                                component={SingleSelectFieldFF}
                                name="dataElement"
                                label="Select commoditie"
                                initialValue={mergedData[0].id}
                                options={mergedData.map(item => ({
                                    label: item.displayName,
                                    value: item.id,
                                }))}  
                            />
                            <ReactFinalForm.Field
                                name="value"
                                label="Dispensed"
                                placeholder="Enter the ammount dispensed"
                                component={InputFieldFF}
                                validate={composeValidators(hasValue, number)}
                            />
                            <Button type="submit" primary>
                                Submit
                            </Button>
                        </form>
                    )}
                </ReactFinalForm.Form>
            </div>
        )
    }


}