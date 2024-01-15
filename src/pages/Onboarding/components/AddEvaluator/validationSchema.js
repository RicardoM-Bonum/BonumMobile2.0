import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(['supervisor', 'partner', 'colaborator'], 'oneOf')
    .required('evoRequire'),
  name: Yup.string().required('nameRequire').min(2, 'nameMin'),
  lastname: Yup.string().required('lastnameRequire').min(2, 'lastnameMin'),
  email: Yup.string().email('emailValid').required('emailRequire')
});

export default validationSchema;
