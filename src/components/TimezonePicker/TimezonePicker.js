import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  FormHelperText
} from 'native-base';
import Select from 'react-select';
import {
  timezonesToReactSelect,
  IANATimezones
} from 'utilities/timezones.utility';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { findIndex } from 'lodash';

function TimezonePicker(props) {
  const { onSubmit = () => null, form = 'timezonepicker' } = props;
  const [timezones] = useState(timezonesToReactSelect());

  const initialValues = () => ({
    timezone: ''
  });

  const { handleSubmit, values, errors, setValues } = useFormik({
    initialValues: initialValues(),
    validationSchema: Yup.object().shape({
      timezone: Yup.string()
        .oneOf(IANATimezones, 'Zona horaria no válida')
        .required('Necesitamos tu proveedor de calendario')
    }),
    onSubmit: async () => {
      onSubmit();
    }
  });

  const getIndexOfTimezone = (timezone) =>
    findIndex(timezones, {
      value: timezone
    });

  const setTimeZoneFromBrowser = () => {
    const index = getIndexOfTimezone(
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    if (index >= 0) setValues({ ...values, timezone: timezones[index].value });
  };

  const handleSelectChange = (option) => {
    setValues({ ...values, timezone: option.value });
  };

  useEffect(() => {
    if (timezones) setTimeZoneFromBrowser();
  }, [timezones]);

  return (
    <div className="TimezonePicker">
      <form className="TimezonePicker__form" onSubmit={handleSubmit} id={form}>
        <FormControl isInvalid={errors.timezone}>
          <Select
            defaultValue={timezones[getIndexOfTimezone(values.timezone)]}
            options={timezones}
            onChange={handleSelectChange}
            className="TimezonePicker__select"
            value={timezones[getIndexOfTimezone(values.timezone)]}
          />

          <FormHelperText textAlign="left" fontSize="xl" mb="10">
            Puedes buscar dando click y comenzando a escribir{' '}
          </FormHelperText>

          {errors?.timezone ? (
            <FormErrorMessage fontSize="lg">{errors.timezone}</FormErrorMessage>
          ) : null}
        </FormControl>
      </form>
    </div>
  );
}

export default TimezonePicker;
