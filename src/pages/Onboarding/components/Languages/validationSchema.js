import * as Yup from 'yup';
import { availableLanguages } from 'utilities/availableLanguages.utility';

const validationSchema = Yup.object().shape({
  languages: Yup.string()
    .oneOf(availableLanguages, 'Idioma no válido')
    .required('Necesitas seleccionar al menos un idioma')
});

export default validationSchema;
