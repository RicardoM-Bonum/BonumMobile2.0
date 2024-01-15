import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import Calendar from '../Calendar';
import Advice from '../../pages/CoacheeCalendar/components/Advice';
import { useCoachCalendar } from '../../hooks';
import { PrimaryButton } from '../Buttons';

export default function TermsConditions({ isOpen, onClose }) {
  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        style={tw.style('justify-center items-center my-4')}
      >
        <View
          style={tw.style(
            'px-6 py-8 mx-6 my-14 bg-white shadow-md rounded-3xl my-auto max-h-[80%]'
          )}
        >
          <ScrollView>
            <Text
              style={tw.style(
                'font-semibold text-xl text-gray-800 text-center'
              )}
            >
              Terminos y condiciones
            </Text>
            <Text style={tw.style('mt-4 text-base text-[#7F7C82]')}>
              The margin set on the last child will push all other children to
              the left as far as their styles will allow, and push itself as far
              right as any other styles will allow. You can test this out by
              also adding margin-right: auto; to the last child, and you will
              see the last child centered perfectly in the remaining space of
              the parent div, after the first three children take up their
              allotted space. This is because the competing "margin autos" will
              both share equally whatever space remains, since they can't cancel
              each other out and won't override each other. Flex box was
              designed to handle margin spacing like this, so take advantage of
              it, as well as the other unique spacing options available under
              the justify-content property. he margin set on the last child will
              push all other children to the left as far as their styles will
              allow, and push itself as far right as any other styles will
              allow. You can test this out by also adding margin-right: auto; to
              the last child, and you will see the last child centered perfectly
              in the remaining space of the parent div, after the first three
              children take up their allotted space. This is because the
              competing "margin autos" will both share equally whatever space
              remains, since they can't cancel each other out and won't override
              each other. Flex box was designed to handle margin spacing like
              this, so take advantage of it, as well as the other unique spacing
              options available under the justify-content property. he margin
              set on the last child will push all other children to the left as
              far as their styles will allow, and push itself as far right as
              any other styles will allow. You can test this out by also adding
              margin-right: auto; to the last child, and you will see the last
              child centered perfectly in the remaining space of the parent div,
              after the first three children take up their allotted space. This
              is because the competing "margin autos" will both share equally
              whatever space remains, since they can't cancel each other out and
              won't override each other. Flex box was designed to handle margin
              spacing like this, so take advantage of it, as well as the other
              unique spacing options available under the justify-content
              property.
            </Text>
          </ScrollView>
          <PrimaryButton
            onPress={onClose}
            title="Cerrar"
            style={tw.style('bg-[#707070] mt-6')}
          />
        </View>
      </Modal>
    </View>
  );
}
