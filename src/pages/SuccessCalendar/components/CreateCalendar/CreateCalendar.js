import React, { useEffect, useState } from 'react';
import {
  FormControl,
  FormErrorMessage,
  Button,
  FormLabel,
  FormHelperText
} from '@chakra-ui/react';
import Select from 'react-select';
import {
  timezonesToReactSelect,
  IANATimezones
} from 'utilities/timezones.utility';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { findIndex } from 'lodash';
import { useFetchAndLoad, useUserUtilities } from 'hooks';
import displayToast from 'utilities/toast.utility';
import {
  createBonumCoachingCalendar,
  createUserCalendar
} from 'services/calendar.service';
import { useSelector } from 'react-redux';
import { updateUserCalendar } from 'services/user.service';

function CreateCalendar() {
  const [timezones] = useState(timezonesToReactSelect());
  const user = useSelector((state) => state.user);
  const { loading, callEndpoint } = useFetchAndLoad();
  const { refreshUser, userUtilitiesLoading } = useUserUtilities();

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
    onSubmit: async (formValues) => {
      try {
        const bonumCalendar = await callEndpoint(
          createBonumCoachingCalendar(
            formValues.timezone,
            user.providers[0].provider
          )
        );

        const createMongoCalendar = await callEndpoint(
          createUserCalendar(bonumCalendar.data.data, user)
        );

        await callEndpoint(updateUserCalendar(user, createMongoCalendar.data));

        await refreshUser();
        displayToast('Calendario creado con éxito', 'success');
      } catch (error) {
        displayToast('Error creando el calendario', 'error');
      }
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
    <div className="CreateCalendar background">
      <h3 className="CreateCalendar__title">Calendario de Bonum Coaching</h3>
      <p className="CreateCalendar__subtitle">
        Crearemos un calendario en tu proveedor elegido, esto para organizar tus
        sesiones de Bonum Coaching
      </p>

      <form className="CreateCalendar__form Card" onSubmit={handleSubmit}>
        <FormControl isInvalid={errors.timezone}>
          <FormLabel as="legend" fontSize="2xl">
            Elige tu zona horaria
          </FormLabel>
          <Select
            defaultValue={timezones[getIndexOfTimezone(values.timezone)]}
            options={timezones}
            onChange={handleSelectChange}
            className="CreateCalendar__select"
            value={timezones[getIndexOfTimezone(values.timezone)]}
          />

          <FormHelperText textAlign="left" fontSize="xl" mb="10">
            Puedes buscar dando click y comenzando a escribir{' '}
          </FormHelperText>

          {errors?.timezone ? (
            <FormErrorMessage fontSize="lg">{errors.timezone}</FormErrorMessage>
          ) : null}
        </FormControl>

        <Button
          className="Button Button--primary"
          isLoading={loading || userUtilitiesLoading}
          disabled={loading || userUtilitiesLoading}
          type="submit"
          mb={10}
        >
          Crear Calendario
        </Button>
      </form>
    </div>
  );
}

export default CreateCalendar;
