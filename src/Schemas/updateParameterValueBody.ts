const updateParameterValueBody = {
  type: 'object' as const,
  required: ['parameters', 'parameterType'],
  properties: {
    parameterType: {
      type: 'string' as const,
    },
    parameters: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          ageRange: {
            type: 'string' as const,
          },
          sex: {
            type: 'string' as const,
          },
          id: {
            type: 'string' as const,
          },
          value: {
            type: 'number' as const,
          },
          parameterType: {
            type: 'string' as const,
          },
          order: {
            type: 'number' as const,
          },
          description: {
            type: 'string' as const,
          },
        },
        oneOf: [
          {
            required: ['parameterType', 'ageRange', 'sex', 'value'],
          },
          {
            required: ['parameterType', 'id', 'value'],
          },
          {
            required: ['parameterType', 'ageRange', 'sex', 'order', 'value'],
          },
        ],
      },
    },
  },
};

export default updateParameterValueBody;
