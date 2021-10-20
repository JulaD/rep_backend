const updateParameterValueBody = {
  type: 'object' as const,
  required: ['parameters'],
  properties: {
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
            pattern: '(^Masculino$)|(^Femenino$)',
          },
          id: {
            type: 'string' as const,
          },
          value: {
            type: 'number' as const,
          },
          order: {
            type: 'number' as const,
            minimum: 0,
          },
          description: {
            type: 'string' as const,
          },
        },
        anyOf: [
          {
            parameterType: {
              type: 'string' as const,
              pattern: '(^TMB$)|(^GET$)|(^Energia para crecimiento$)',
            },
            required: ['parameterType', 'ageRange', 'sex', 'order', 'value'],
          },
          {
            parameterType: {
              type: 'string' as const,
              pattern: '^Peso por defecto$',
            },
            required: ['parameterType', 'ageRange', 'sex', 'value'],
          },
          {
            parameterType: {
              type: 'string' as const,
              pattern: '(^NAF Menores$)|(^NAF Adultos$)|(^Embarazo y lactancia$)',
            },
            required: ['parameterType', 'id', 'value'],
          },
        ],
      },
    },
  },
};

export default updateParameterValueBody;
