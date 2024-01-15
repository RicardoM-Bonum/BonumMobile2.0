import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  provider: Yup.string()
    .oneOf(['gmail', 'outlook', 'icloud'], 'oneOf')
    .required('evoRequire'),
  email: Yup.string().email('emailValid').required('emailRequire')
});

export default validationSchema;
