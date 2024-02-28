import React, {useState, useRef} from 'react';
import {NavigationContainer, DefaultTheme} from '@react-navigation/native';

import {
  createDrawerNavigator,
  DrawerToggleButton,
} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import IconFont from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {verifyRoutes} from '../utilities/verifyRoutes';

//pages
import {Login} from '../pages';
import Dashboard from '../pages/Dashboard';
import Evaluadores from '../pages/Evaluadores';
import AreasFoco from '../pages/AreasFoco';
import BuscandoCoach from '../pages/BuscandoCoach';
import AgendarCoach from '../pages/AgendarCoach';
import Onboarding from '../pages/Onboarding';
import MyCoach from '../pages/MyCoach';
import {CoachEvaluation} from '../pages/CoachEvaluation';
import Evaluations from '../pages/CoachEvaluation/components/Evaluations/Evaluations';
import SessionEvaluation from '../pages/SessionEvaluation';
import CoacheeResume from '../pages/MyCoachees/components/CoacheeResume';
import SessionInfo from '../pages/MyCoachees/components/SessionInfo/';
import ScheduleAppointment from '../pages/ScheduleAppointment';
import ConnectCalendar from '../pages/ConnectCalendar';
import CoachCalendar from '../pages/CoachCalendar';
import SuccessCalendar from '../pages/SuccessCalendar';
import Session from '../pages/MySessions/components/Session';
import Meeting from '../pages/Meeting/Meeting';
import {UpdateLanguages} from '../pages/UpdateLanguages';
import RescheduleAppointment from '../pages/RescheduleAppointment';
import MyEvaluations from '../pages/MyEvaluations';
import Preferences from '../pages/Preferences';
import Icon from 'react-native-vector-icons/Entypo';
import {View} from 'react-native';
import {useTranslation} from 'react-i18next';

const Drawer = createDrawerNavigator();

function HeaderLeft({isPrincipal, goBack}) {
  const openMenu = () => {
    goBack();
  };

  if (!isPrincipal) {
    return (
      <TouchableOpacity onPress={openMenu} style={{marginLeft: 20}}>
        <IconFont name="angle-left" size={30} color="#299EFF" />
      </TouchableOpacity>
    );
  }
}

function Navigation() {
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#fafafa',
    },
  };

  const insets = useSafeAreaInsets();
  const ref = useRef(null);
  const {t} = useTranslation('global');

  const [isPrincipal, setIsPrincipal] = useState(true);
  const {role, onboardingCompleted, uid} = useSelector(state => state.user);
  const isCoachee = role === 'coachee';

  return (
    <NavigationContainer theme={theme} ref={ref}>
      <Drawer.Navigator
        // initialRouteName="Dashboard"
        screenOptions={{
          swipeEnabled: false,
          drawerType: 'front',
          xtyle: {
            backgroundColor: 'transparent',
            marginTop: insets.top + 5,
            marginBottom: insets.bottom + 5,
            width: '90%',
          },
          headerStyle: {
            backgroundColor: '#fafafa',
          },
          headerLeft: () =>
            onboardingCompleted && (
              <HeaderLeft
                isPrincipal={isPrincipal}
                goBack={ref.current.goBack}
              />
            ),
          headerRight: () => <DrawerToggleButton />,
          iconContainerStyle: {paddingLeft: 20, marginLeft: 20},
          headerTitleStyle: {display: 'none'},
          drawerActiveTintColor: 'white',
          drawerLabelStyle: {marginLeft: -15, fontSize: 16, color: 'black'},
        }}
        drawerContent={props => <CustomDrawer {...props} />}
        screenListeners={() => ({
          state: () => verifyRoutes({ref, setIsPrincipal}),
        })}>
        {uid ? (
          onboardingCompleted ? (
            <>
              <Drawer.Screen
                name="Dashboard"
                component={Dashboard}
                options={{
                  title: t('components.menu.home'),
                  drawerIcon: () => (
                    <View
                      style={{
                        backgroundColor: 'rgba(34, 34, 34, .15)',
                        borderRadius: 50,
                        padding: 5,
                      }}>
                      <Icon name={'home'} color={'white'} size={18} />
                    </View>
                  ),
                }}
              />
              <Drawer.Screen
                name="Preferences"
                component={Preferences}
                options={{
                  title: t('components.menu.preferences'),
                  drawerIcon: color => (
                    <View
                      style={{
                        backgroundColor: 'rgba(34, 34, 34, .15)',
                        borderRadius: 50,
                        padding: 5,
                      }}>
                      <Icon name={'cog'} color={'white'} size={16} />
                    </View>
                  ),
                }}
              />

              <Drawer.Screen
                name="CoachEvaluation"
                component={CoachEvaluation}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="Evaluations"
                component={Evaluations}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="Evaluadores"
                component={Evaluadores}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="AreasFoco"
                component={AreasFoco}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="BuscandoCoach"
                component={BuscandoCoach}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="AgendarCoach"
                component={AgendarCoach}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="AgendarCoachee"
                component={ScheduleAppointment}
                options={{drawerItemStyle: {display: 'none'}}}
              />

              <Drawer.Screen
                name="ReagendarCoachee"
                component={RescheduleAppointment}
                options={{drawerItemStyle: {display: 'none'}}}
              />

              <Drawer.Screen
                name="SessionEvaluation"
                component={SessionEvaluation}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="CoacheeResume"
                component={CoacheeResume}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="SessionInfo"
                component={SessionInfo}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="connectcalendar"
                component={ConnectCalendar}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="CoachCalendar"
                options={{
                  animationEnabled: true,
                  title: 'Calendario Coach',
                  drawerItemStyle: {display: 'none'},
                }}
                component={CoachCalendar}
              />
              <Drawer.Screen
                name="SuccessCalendar"
                component={SuccessCalendar}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="Session"
                component={Session}
                options={{drawerItemStyle: {display: 'none'}}}
              />
              <Drawer.Screen
                name="Meeting"
                component={Meeting}
                options={{
                  unmountOnBlur: true,
                  drawerItemStyle: {display: 'none'},
                  headerStyle: {
                    backgroundColor: 'black',
                  },
                }}
              />

              <Drawer.Screen
                name="UpdateLanguages"
                component={UpdateLanguages}
                options={{
                  drawerItemStyle: {display: 'none'},
                  headerShown: false,
                }}
              />

              {isCoachee && (
                <>
                  <Drawer.Screen
                    name="MyCoach"
                    component={MyCoach}
                    options={{
                      title: 'Mi Coach',
                      drawerIcon: color => (
                        <View
                          style={{
                            backgroundColor: 'rgba(34, 34, 34, .15)',
                            borderRadius: 50,
                            padding: 5,
                          }}>
                          <Icon name={'user'} color={'white'} size={16} />
                        </View>
                      ),
                    }}
                  />

                  <Drawer.Screen
                    name="MyEvaluations"
                    component={MyEvaluations}
                    options={{
                      title: t('components.menu.myEvaluations'),
                      drawerIcon: color => (
                        <View
                          style={{
                            backgroundColor: 'rgba(34, 34, 34, .15)',
                            borderRadius: 50,
                            padding: 5,
                          }}>
                          <Icon name={'news'} color={'white'} size={16} />
                        </View>
                      ),
                    }}
                  />
                </>
              )}
            </>
          ) : (
            <Drawer.Screen
              name="Onboarding"
              component={Onboarding}
              options={{drawerItemStyle: {display: 'none'}}}
            />
          )
        ) : (
          <Drawer.Screen
            name="Login"
            component={Login}
            options={{
              drawerItemStyle: {display: 'none'},
              headerShown: false,
            }}
          />
        )}
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default Navigation;
