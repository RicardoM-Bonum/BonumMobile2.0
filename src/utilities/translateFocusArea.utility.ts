import i18 from 'i18next';

const translateFocusArea = focusArea => {
  switch (i18.language) {
    case 'es':
      return focusArea?.title || focusArea.focusArea;
    case 'en':
      return focusArea.en;
    case 'pt':
      return focusArea.pt;
    default:
      return focusArea.title;
  }
};

export default translateFocusArea;
