import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import {
  PrimaryButton,
  SecondaryButton
} from '../../../../../../components/Buttons';
import SessionInfoContext from '../../context/SessionInfoContext';
import { updateSession } from '../../../../../../services/sessions.service';
import { useFetchAndLoad } from '../../../../../../hooks';
import displayToast from '../../../../../../utilities/toast.utility';
import QuillEditor, { QuillToolbar } from 'react-native-cn-quill';
import { ScrollView } from 'react-native-gesture-handler';

export default function Comments() {
  const _editor = React.createRef();
  const { selectedSession: session, setSelectedSession } =
    useContext(SessionInfoContext);
  const [comment, setComment] = useState(session.coachPrivateComments);
  const { loading, callEndpoint } = useFetchAndLoad();

  const handleSave = async () => {
    try {
      console.log({});
      if (!comment) {
        displayToast('Por favor escribir un comentario', 'info');
        return;
      }

      await callEndpoint(
        updateSession({ ...session, coachPrivateComments: comment })
      );
      setSelectedSession({
        ...session,
        coachPrivateComments: comment
      });
      displayToast('Comentario guardado correctamente.', 'info');
    } catch (error) {
      displayToast('Error: ' + error.message, 'info');
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Text
        style={tw.style(
          'text-[#1E2843] font-semibold text-[15px] text-center mt--13'
        )}
      >
        Aqui puedes ingresar notas sobre esta sesión que solo tu vas a poder ver
      </Text>
      {/* <QuillToolbar editor={_editor} options="basic" theme="light"  /> */}
      <QuillEditor
        style={tw.style(
          'text-black bg-white px-8 py-4 rounded-3xl mt-5 shadow-md text-base h-40'
        )}
        ref={_editor}
        loading={loading}
        onHtmlChange={(x) => setComment(x.html)}
        initialHtml={comment}
        quill={{ placeholder: '' }}
      />
      <PrimaryButton
        title="Guardar"
        onPress={handleSave}
        loading={loading}
        style={tw.style('mt-4')}
      />
    </ScrollView>
  );
}

const styles = {
  title: {
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingVertical: 10
  },
  editor: {
    flex: 1,
    padding: 0,
    borderColor: 'gray',
    height: 100,
    borderWidth: 1,
    marginHorizontal: 30,
    marginVertical: 5,
    backgroundColor: 'white'
  }
};
