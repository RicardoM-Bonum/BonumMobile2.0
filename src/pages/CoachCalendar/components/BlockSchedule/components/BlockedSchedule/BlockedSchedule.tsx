// import { Button } from '@chakra-ui/react';
// import { mongoDateToSessionDate } from 'utilities';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SecondaryButton } from '../../../../../../components/Buttons';
import { mongoDateToSessionDate } from '../../../../../../utilities';
import { Text } from 'react-native';

export type BlockedScheduleProps = {
  blockedSchedule: any;
  handleDeleteSchedule: any;
  loading: boolean;
};

const BlockedSchedule: React.FC<BlockedScheduleProps> = ({
  blockedSchedule,
  handleDeleteSchedule
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Fecha Inicial</Text>
        <Text style={styles.subtitle}>
          {mongoDateToSessionDate(blockedSchedule.InitialDate)}
        </Text>
      </View>

      <View>
        <Text style={styles.title}>Fecha Final</Text>
        <Text style={styles.subtitle}>
          {mongoDateToSessionDate(blockedSchedule.EndDate)}
        </Text>
      </View>

      <SecondaryButton
        style={styles.button}
        title="Eliminar"
        onPress={() => handleDeleteSchedule(blockedSchedule)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 10
  },
  button: {
    minWidth: '40%',
    textAlign: 'center'
  }
});

export default BlockedSchedule;
