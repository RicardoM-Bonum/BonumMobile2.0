import * as Yup from 'yup';

const validationSchema = Yup.object({
  resume: Yup.string()
    .min(140, 'Debe ser minimo 140 caracteres')
    .required('El resumen es requerido'),
  work: Yup.string()
    .min(140, 'Debe ser minimo 140 caracteres')
    .required('Esta información es requerido'),
});

export default validationSchema;
