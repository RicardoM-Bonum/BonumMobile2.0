//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { size, map } from 'lodash';
import { dateToLongDate, mongoDateToTime } from '../../../../utilities';
import NoData from '../../../../components/NoData/NoData';

const Sessions = ({ date, sessionsToDisplay }) => {
  const getItemStyle = (session) => {
    const { status, canceled } = session;
    console.log(session.status);
    let backgroundColor = '#299eff';
    if (status) backgroundColor = '#299eff66';
    if (canceled) backgroundColor = '#f93f15c1';
    console.log(backgroundColor);
    return { ...styles.item, backgroundColor };
  };

  useEffect(() => {}, [sessionsToDisplay]);

  return size(sessionsToDisplay) > 0 ? (
    <View styles={styles.wrapper}>
      <Text style={styles.title}>{dateToLongDate(date)}</Text>
      {map(sessionsToDisplay, (session) => (
        <View style={getItemStyle(session)} key={session._id}>
          <Text style={styles.text}>
            Sesión con tu coach {session?.coach?.name} {session.coach.lastname}
          </Text>
          <Text style={styles.text}>{mongoDateToTime(session.date)}</Text>
        </View>
      ))}
    </View>
  ) : (
    <NoData title="No tienes sesiones" />
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: '100%'
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 15,
    color: '#fffff'
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5
  }
});

export default Sessions;
