export const verifyRoutes = ({ ref, setIsPrincipal }) => {
  const currentRoute = ref.current.getCurrentRoute();
  if (
    !ref.current.canGoBack() ||
    currentRoute.name === 'chats' ||
    currentRoute.name === 'PreferencesHome'
  ) {
    setIsPrincipal(true);
  } else {
    setIsPrincipal(false);
  }
};
