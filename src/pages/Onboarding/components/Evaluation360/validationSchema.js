import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  supervisors: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Necesitamos el nombre de tu supervisor/a'),
      lastname: Yup.string().required(
        'Necesitamos el apellido de tu supervisor/a'
      ),
      email: Yup.string()
        .email('El email de tu supervisor/a debe ser válido')
        .required('Necesitamos el email de tu supervisor/a')
    })
  ),
  colaborators: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Necesitamos el nombre de tu colaborador/a'),
      lastname: Yup.string().required(
        'Necesitamos el apellido de tu colaborador/a'
      ),
      email: Yup.string()
        .email('El email de tu colaborador/a debe ser válido')
        .required('Necesitamos el email de tu colaborador/a')
    })
  ),
  partners: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required('Necesitamos el nombre de tu compañero/a'),
      lastname: Yup.string().required(
        'Necesitamos el apellido de tu compañero/a'
      ),
      email: Yup.string()
        .email('El email de tu compañero/a debe ser válido')
        .required('Necesitamos el email de tu compañero/a')
    })
  )
});

export default validationSchema;
