import YupValidationSchema from '../../../utilities/yupValidationSchema.utility';
import {useSelector} from 'react-redux';
import AboutYouCoachValidationSchema from '../components/AboutYouCoach/validationSchema';
import CreateYourAccountValidationSchema from '../components/CreateYourAccount/validationSchema';
import {useTranslation} from 'react-i18next';

const useCoachStepsValidation = async () => {
  const onboarding = useSelector(state => state.onboarding);
  const errors = [];
  const {t} = useTranslation('global');

  const CreateYourAccountValidation = await YupValidationSchema(
    CreateYourAccountValidationSchema,
    onboarding.createYourAccount,
    'Crea tu Cuenta',
  );
  if (CreateYourAccountValidation) {
    errors.push(CreateYourAccountValidation);
  }

  if (!onboarding.photo) {
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorPhoto')}`],
      title: t('pages.onboarding.hooks.photoTitle'),
    });
  }

  const aboutYouValidation = await YupValidationSchema(
    AboutYouCoachValidationSchema,
    onboarding.aboutYouCoach,
    t('pages.onboarding.components.aboutYouCoach.title'),
  );
  if (aboutYouValidation) {
    errors.push(aboutYouValidation);
  }

  if (
    onboarding &&
    onboarding.languages &&
    Array.isArray(onboarding.languages) &&
    onboarding.languages.length < 1
  ) {
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorLenguage')}`],
      title: t('pages.onboarding.hooks.lenguageTitle'),
    });
  }

  // if (!onboarding.video) {
  //   errors.push({
  //     errors: [`${t('pages.onboarding.hooks.errorVideo')}`],
  //     title: t('pages.onboarding.hooks.videoTitle'),
  //   });
  // }

  if (!onboarding.timezone) {
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorTimezone')}`],
      title: t('pages.onboarding.hooks.timezoneTitle'),
    });
  }

  if (onboarding.focusAreas.length < 3) {
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorCoach')}`],
      title: t('pages.onboarding.hooks.focusAreasTile'),
    });
  }

  // console.log(errors);

  if (errors.length > 0) {
    return errors;
  }
  return false;
};

export default useCoachStepsValidation;
