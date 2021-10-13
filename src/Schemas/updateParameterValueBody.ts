const updateParameterValueBody = {
  type: 'object' as const,
  required: ['parameter'],
  properties: {
    parameter: {
      type: 'object' as const,
      required: ['id', 'value', 'parameterType', 'order', 'description'],
      properties: {
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
    },

  },
};

export default updateParameterValueBody;
