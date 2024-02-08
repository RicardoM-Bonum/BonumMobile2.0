import React, {useState, useEffect} from 'react';
import {Text, View, ScrollView, KeyboardAvoidingView} from 'react-native';
import {useSelector} from 'react-redux';
import useFetchAndLoad from '../../hooks/useFetchAndLoad';
import {updateCoachOnboarding} from '../../services/coach.service';
import {Steps, useSteps} from './components/Steps';
import useCoachStepsValidation from './hooks/useCoachStepsValidation';
import useCoacheeStepsValidation from './hooks/useCoacheeStepsValidation';
import {useUserUtilities} from '../../hooks';
import {
  AboutYouCoach,
  FocusAreas,
  ChooseCoach,
  Arrows,
  MuestraTuSonrisa,
  Evaluation360,
  UploadVideo,
  CreateYourAccount,
  WorkSchedule,
  Languages,
  PickTimezone,
} from './components';
// import PickTimezone from '../../components/PickTimezone';
import {saveUserWorkingHours} from '../../services/calendar.service';
import {useTranslation} from 'react-i18next';
import {Modal} from 'native-base';

function Onboarding({navigation}) {
  const user = useSelector((state: any) => state.user);
  const onboarding = useSelector((state: any) => state.onboarding);
  const coacheeValidation = useCoacheeStepsValidation();
  const coachValidation = useCoachStepsValidation();
  const [showArrows, setShowArrows] = useState(true);
  const [disableArrows, setDisableArrows] = useState(false);
  const {t} = useTranslation('global');
  const {refreshUser} = useUserUtilities();

  const coachSteps = [
    {step: 0, label: 'Crea tu Cuenta', content: CreateYourAccount},
    {step: 1, label: 'Muestranos Tu Sonrisa', content: MuestraTuSonrisa},
    {
      step: 2,
      label: 'Cuéntanos acerca de ti',
      content: AboutYouCoach,
    },
    {
      step: 3,
      label: 'Compartenos un video de presentación',
      content: UploadVideo,
    },
    {step: 4, label: 'Selecciona tu zona horaria', content: PickTimezone},
    {step: 5, label: 'Selecciona', content: Languages},
    {step: 6, label: 'Selecciona hasta 3 areas de foco', content: FocusAreas},
    {
      step: 7,
      label: 'Selecciona tu horario de trabajo',
      content: WorkSchedule,
    },
  ];

  const coacheeSteps = [
    {step: 0, label: 'Crea tu cuenta', content: CreateYourAccount},
    {step: 1, label: 'Muestranos tu sonrisa', content: MuestraTuSonrisa},
    {step: 2, label: 'Selecciona tu zona horaria', content: PickTimezone},
    {step: 3, label: 'Selecciona tus idiomas preferidos', content: Languages},
    {
      step: 4,
      label: 'Dejanos Saber quienes te acompañaran en el camino',
      content: Evaluation360,
    },
    {step: 5, label: 'Selecciona hasta 3 areas de foco', content: FocusAreas},
    {
      step: 6,
      label: '',
      content: ChooseCoach,
    },
  ];

  const [modal, setModal] = useState(false);

  const {callEndpoint} = useFetchAndLoad();

  const updateCoach = async () => {
    try {
      await callEndpoint(updateCoachOnboarding(onboarding, user));
      await callEndpoint(saveUserWorkingHours(onboarding.workSchedule));
      await refreshUser();
      navigation.navigate('Dashboard');
    } catch (error) {
      console.log(error);
    }
  };

  const {nextStep, prevStep, activeStep, errors, barActive, activeBarStep} =
    useSteps({
      initialStep: 0,
      stepsCount:
        user.role === 'coach' ? coachSteps.length : coacheeSteps.length,
      activeBarStep: user.role === 'coach' ? 90 : 3,
      validationStep: user.role === 'coach' ? 7 : coacheeSteps.length - 2,
      userRole: user.role,
      validation: user.role === 'coach' ? coachValidation : coacheeValidation,
      onLastStep: user.role === 'coach' ? updateCoach : null,
    });

  useEffect(() => {
    if (user.onboardingCompleted) {
      navigation.navigate('Dashboard');
    }
  }, []);

  useEffect(() => {
    if (errors) {
      console.log(errors);
      setModal(true);
    }
  }, [errors]);

  const onClose = () => setModal(false);
  // console.log({showArrows}, {activeStep});

  return (
    <ScrollView
      style={{flex: 1}}
      // contentContainerStyle={{ flex: 1 }}
      automaticallyAdjustKeyboardInsets>
      {activeStep > 0 && showArrows && (
        <Arrows
          prevStep={prevStep}
          nextStep={nextStep}
          disableArrows={disableArrows}
        />
      )}
      <Steps
        navigation={navigation}
        steps={user.role === 'coach' ? coachSteps : coacheeSteps}
        activeStep={activeStep}
        nextStep={nextStep}
        barActive={barActive}
        prevStep={prevStep}
        activeBarStep={activeBarStep}
        setShowArrows={setShowArrows}
        setDisableArrows={setDisableArrows}
      />

      <Modal isOpen={modal} onClose={() => setModal(false)} size={'lg'}>
        <Modal.Content height={'96'} paddingX={'5'} paddingY={'5'}>
          {errors &&
            errors.map(error => (
              <View style={{paddingBottom: 10}} key={error.title}>
                <Text style={{fontWeight: 'bold'}}>{error.title}</Text>
                {error.errors.map(onboardingError => (
                  <Text style={{color: 'red'}}>• {onboardingError}</Text>
                ))}
              </View>
            ))}
        </Modal.Content>
      </Modal>
    </ScrollView>
  );
}

export default Onboarding;
