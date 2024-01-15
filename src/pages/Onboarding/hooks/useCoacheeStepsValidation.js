import YupValidationSchema from '../../../utilities/yupValidationSchema.utility';
import { useSelector } from 'react-redux';
// import aboutYouValidationSchema from '../components/AboutYou/validationSchema';
import evaluationValidationSchema from '../components/Evaluation360/validationSchema';
import { useTranslation } from 'react-i18next';

const useCoacheeStepsValidation = async () => {
  const onboarding = useSelector((state) => state.onboarding);
  const { cohort } = useSelector((state) => state.user);
  const coacheeAreasByProgram = cohort?.program < 12 ? 2 : 3;
  const errors = [];
  const { t } = useTranslation('global');

  const evaluationValidation = await YupValidationSchema(
    evaluationValidationSchema,
    onboarding.evaluation,
    'Evaluación 360'
  );

  if (evaluationValidation) errors.push(evaluationValidation);

  if (onboarding && onboarding.languages && Array.isArray(onboarding.languages) && onboarding.languages.length < 1)
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorLenguage')}`],
      title: t('pages.onboarding.hooks.lenguageTitle')
    });

  if (!onboarding.photo)
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorPhoto')}`],
      title: t('pages.onboarding.hooks.photoTitle')
    });

  if (onboarding.focusAreas.length < coacheeAreasByProgram)
    errors.push({
      errors: [
        `${t('pages.onboarding.hooks.errorFocusAreas', {
          coacheeAreasByProgram: coacheeAreasByProgram
        })}`
      ],
      title: t('pages.onboarding.hooks.focusAreasTile')
    });

  if (!onboarding.timezone)
    errors.push({
      errors: [`${t('pages.onboarding.hooks.errorTimezone')}`],
      title: t('pages.onboarding.hooks.timezoneTitle')
    });

  if (errors.length > 0) return errors;
  return false;
};

export default useCoacheeStepsValidation;
