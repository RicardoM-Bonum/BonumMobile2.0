const YupValidationSchema = async (schema, values, title) => {
  try {
    await schema.validate(values, {
      abortEarly: false
    });
    return false;
  } catch (error) {
    return { errors: error.errors, title };
  }
};

export default YupValidationSchema;
