import passwordRegex from '../../../../utilities/passwordRegex.utility';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  lastname: Yup.string().required('lastnameRequire').min(2, 'lastnameMin'),
  password: Yup.string()
    .required('Contraseña nueva es requerida')
    .matches(passwordRegex, 'passMatch'),
  old_password: Yup.string().required('Contraseña actual es requerida'),
  name: Yup.string().required('nameRequire').min(2, 'nameMin')
});

export default validationSchema;
