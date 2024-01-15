import { View, Text, Modal } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

export default function ModalProgress({
  isOpen,
  onClose,
  uploading,
  progress
}) {
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      style={tw.style('justify-center items-center')}
      onDismiss={() => onClose(false)}
      onRequestClose={() => onClose(false)}
      on
    >
      <View style={tw.style('flex-1 justify-center bg-[#000000af] ')}>
        <View style={tw.style('px-6 py-8 m-6 bg-white shadow-md rounded-3xl')}>
          {uploading && (
            <View className="flex flex-row justify-center w-full my-4">
              <AnimatedCircularProgress
                size={200}
                width={15}
                fill={progress}
                tintColor="#00e0ff"
                onAnimationComplete={() => console.log('onAnimationComplete')}
                backgroundColor="#3d5875"
              >
                {() => (
                  <Text style="px-6 py-6">
                    Subiendo archivo: {progress.toFixed(2)}%
                  </Text>
                )}
              </AnimatedCircularProgress>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
