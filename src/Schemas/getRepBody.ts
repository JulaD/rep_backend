const getRepBody = {
  type: 'object' as const,
  required: ['groups', 'extraData', 'fromTemplate'],
  properties: {
    fromTemplate: {
      type: 'boolean' as const,
    },
    groups: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        required: ['age', 'sex', 'medianWeight', 'population'],
        properties: {
          age: {
            type: 'string' as const,
          },
          sex: {
            type: 'string' as const,
            pattern: '(^Masculino$)|(^Femenino$)',
          },
          medianWeight: {
            type: 'number' as const,
            minimum: 0,
          },
          population: {
            type: 'number' as const,
            minumum: 0,
          },
        },
      },
    },
    extraData: {
      type: 'object' as const,
      properties: {
        minorPAL: {
          type: 'object' as const,
          required: ['lowPALPrevalence', 'moderatePALPrevalence', 'intensePALPrevalence'],
          properties: {
            lowPALPrevalence: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            moderatePALPrevalence: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            intensePALPrevalence: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
          },
        },
        adultPAL: {
          type: 'object' as const,
          required: ['urbanPercentage', 'activeUrbanPAL', 'lowUrbanPAL', 'ruralPercentage', 'activeRuralPAL', 'lowRuralPAL'],
          properties: {
            urbanPercentage: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            activeUrbanPAL: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            lowUrbanPAL: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            ruralPercentage: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            activeRuralPAL: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
            lowRuralPAL: {
              type: 'number' as const,
              minimum: 0,
              maximum: 100,
            },
          },
        },
        maternity18To29: {
          type: 'object' as const,
          properties: {
            pregnantWomen: {
              type: 'number' as const,
              minimum: 0,
            },
            lactatingWomen: {
              type: 'number' as const,
              minimum: 0,
            },
            countryBirthRate: {
              type: 'number' as const,
              minimum: 0,
            },
            countryWomenInAgeGroup: {
              type: 'number' as const,
              exclusiveMinimum: 0,
            },
            countryPopulation: {
              type: 'number' as const,
              exclusiveMinimum: 0,
            },
          },
          oneOf: [
            {
              required: ['pregnantWomen', 'lactatingWomen'],
            },
            {
              required: ['countryBirthRate', 'countryWomenInAgeGroup', 'countryPopulation'],
            },
          ],
        },
        maternity30To59: {
          type: 'object' as const,
          properties: {
            pregnantWomen: {
              type: 'number' as const,
              minimum: 0,
            },
            lactatingWomen: {
              type: 'number' as const,
              minimum: 0,
            },
          },
        },
      },
    },

  },
};

export default getRepBody;
