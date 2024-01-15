import { Image } from 'react-native';
import React from 'react';

export default function Avatar({ size, user }) {
  const isCoach = user?.role === 'coach';
  return (
    <Image
      style={{
        width: size,
        height: size,
        borderRadius: size
      }}
      source={
        user?.urlImgCoach || user?.urlImgCoachee
          ? { uri: isCoach ? user?.urlImgCoach : user?.urlImgCoachee }
          : require('../../../../../../assets/img/foto_perfil-blanco.png')
      }
      resizeMode="cover"
    />
  );
}
