CREATE TABLE Parameters (
  id VARCHAR(100) NOT NULL,
  value INT NOT NULL,
  parameterType INT NOT NULL,
  PRIMARY KEY (id)
);

-- pesos por defecto
INSERT INTO Parameters (id, value, parameterType) VALUES ('0Month-Male', 3.3, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('1Month-Male', 4.5, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('2Month-Male', 5.6,1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('3Month-Male', 6.4, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('4Month-Male', 7.0, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('5Month-Male', 7.5, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('6Month-Male', 7.9, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('7Month-Male', 8.3, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('8Month-Male', 8.6, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('9Month-Male', 8.9, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('10Month-Male', 9.2, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('11Month-Male', 9.4, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('1Year-Male', 10.9, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('2Year-Male', 13.3, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('3Year-Male', 15.3, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('4Year-Male', 17.3, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('5Year-Male', 19.5, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('6Year-Male', 21.8, 1);
INSERT INTO Parameters (id, value, parameterType) VALUES ('7Year-Male', 24.2, 1);



