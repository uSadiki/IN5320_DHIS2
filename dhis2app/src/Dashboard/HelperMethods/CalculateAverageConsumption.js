function calculateAverageConsumption(data, categoryOptionComboToRetrieve, periodsToRetrieve) {
    const averageConsumptionData = {};

    data.dataElements.dataElements.forEach(d => {
        let totalConsumption = 0;
        let periodCount = 0;

        for (const period of periodsToRetrieve) {
            const matchedValue = data.dataValues.dataValues.find(dataValue => {
                return (
                    dataValue.dataElement === d.id &&
                    dataValue.categoryOptionCombo === categoryOptionComboToRetrieve &&
                    dataValue.period === period
                );
            });

            if (matchedValue && matchedValue.value !== null) {
                totalConsumption += parseFloat(matchedValue.value);
                periodCount++;
            }
        }

        const averageConsumption = periodCount > 0 ? totalConsumption / periodCount : null;
        averageConsumptionData[d.displayName] = averageConsumption;
    });

    return averageConsumptionData;
}

export default calculateAverageConsumption;