import React from 'react';
import { KeyboardAvoidingView, Progress, Text } from 'native-base';
import { useSteps } from '../../hooks/useSteps';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function Steps({
  steps,
  activeStep,
  nextStep,
  prevStep,
  barActive,
  activeBarStep,
  setShowArrows = () => {},
  setDisableArrows = () => {},
  navigation
}) {
  const Step = steps[activeStep].content;
  const { t } = useTranslation('global');

  return (
    <View style={{ flex: 1 }}>
      {/* {barActive ? (
        <View className="Steps__bar">
          <Text className="Steps__step">
            {t('pages.onboarding.components.steps.step', {
              no: activeStep - (activeBarStep - 1)
            })}
          </Text>
          <Progress
            className="Steps__progress"
            value={activeStep - activeBarStep + 2}
            min={1}
            max={4}
            colorScheme="bonumBlue"
            height="5"
          />
        </View>
      ) : null} */}

      <Step
        navigation={navigation}
        nextStep={nextStep}
        prevStep={prevStep}
        setShowArrows={setShowArrows}
        setDisableArrows={setDisableArrows}
      />
    </View>
  );
}

export { Steps, useSteps };
