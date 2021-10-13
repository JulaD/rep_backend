const getRepBody = {
  type: 'object' as const,
  required: ['groups', 'extraData'],
  properties: {
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
          },
          medianWeight: {
            type: 'number' as const,
          },
          population: {
            type: 'number' as const,
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
            },
            moderatePALPrevalence: {
              type: 'number' as const,
            },
            intensePALPrevalence: {
              type: 'number' as const,
            },
          },
        },
        adultPAL: {
          type: 'object' as const,
          required: ['urbanPercentage', 'activeUrbanPAL', 'lowUrbanPAL', 'ruralPercentage', 'activeRuralPAL', 'lowRuralPAL'],
          properties: {
            urbanPercentage: { type: 'number' as const },
            activeUrbanPAL: { type: 'number' as const },
            lowUrbanPAL: { type: 'number' as const },
            ruralPercentage: { type: 'number' as const },
            activeRuralPAL: { type: 'number' as const },
            lowRuralPAL: { type: 'number' as const },
          },
        },
        maternity18To29: {
          type: 'object' as const,
          properties: {
            pregnantWomen: { type: 'number' as const },
            lactatingWomen: { type: 'number' as const },
            countryBirthRate: { type: 'number' as const },
            countryWomenInAgeGroup: { type: 'number' as const },
            countryPopulation: { type: 'number' as const },
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
            pregnantWomen: { type: 'number' as const },
            lactatingWomen: { type: 'number' as const },
            countryBirthRate: { type: 'number' as const },
            countryWomenInAgeGroup: { type: 'number' as const },
            countryPopulation: { type: 'number' as const },
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
      },
    },

  },
};

export default getRepBody;
