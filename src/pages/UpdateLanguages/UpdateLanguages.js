import React, { useState } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Languages from './components/Languages';
import PickTimezone from './components/PickTimezone';
import { PrimaryButton } from '../../components/Buttons';
import { Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { useFetchAndLoad, useUserUtilities } from '../../hooks';
import displayToast from '../../utilities/toast.utility';
import { updateUserLanguagesAndTimezone } from '../../services/user.service';
import { modifyUser } from '../../redux/slices/user';

function UpdateLanguages({ navigation }) {
  const [values, setValues] = useState({ languages: [], timezone: null });
  const user = useSelector((state) => state.user);
  const { role, mongoID } = user;
  const { callEndpoint, loading } = useFetchAndLoad();
  const isCoach = role === 'coach';
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!values.languages || values.languages.length < 1) {
      displayToast('Debes seleccionar al menos un lenguaje');
      return;
    }

    if (!values.timezone) {
      displayToast('Debes seleccionar una zona horaria');
      return;
    }

    //Update language and timezone
    try {
      await callEndpoint(updateUserLanguagesAndTimezone(mongoID, role, values));

      displayToast('Lenguajes actualizados con éxito', 'success');
      dispatch(
        modifyUser({ languages: values.languages, timezone: values.timezone })
      );

      navigation.navigate('Dashboard');
    } catch (error) {
      displayToast('Error actualizando tus idiomas', 'error');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20, alignItems: 'center' }}>
      <ScrollView
        contentContainerStyle={{ marginTop: 20, paddingHorizontal: 20 }}
      >
        <Text style={tw.style('text-black text-center text-xl font-bold')}>
          Hola!
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mt-5')}>
          Hemos añadido una nueva funcionalidad
        </Text>
        <Text style={tw.style('text-[#707070] text-center text-sm mb-5')}>
          {isCoach
            ? 'Ahora podrás impartir tus sesiones en diferentes idiomas'
            : 'Ahora podrás tomar tus sesiones en los idiomas de tu preferencia'}
        </Text>
        <Languages values={values} setValues={setValues} />

        <Text style={tw.style('text-[#707070] text-center text-sm mb-5')}>
          También, para asegurarnos que tus horarios son los correctos, tendrás
          que elegir tu zona horaria
        </Text>
        <PickTimezone values={values} setValues={setValues} />
        <PrimaryButton
          title="Guardar"
          onPress={handleSubmit}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

export default UpdateLanguages;
