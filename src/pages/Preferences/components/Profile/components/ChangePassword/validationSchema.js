import * as Yup from 'yup'
import passwordRegexUtility from '../../../../../../utilities/passwordRegex.utility'

const validationSchema = Yup.object({
  current_password: Yup.string().required('La contraseña actual es requerida'),
  new_password: Yup.string()
    .required('La contraseña es requerida')
    .matches(
      passwordRegexUtility,
      'Debe contener 8 caracteres o más, Una mayúscula, Una minúscula y un número'
    ),
  new_password_confirm: Yup.string()
    .required('El campo es requerido')
    .oneOf([Yup.ref('new_password'), null], 'Las contraseñas deben coincidir')
})

export default validationSchema
