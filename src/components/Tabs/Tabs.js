import * as React from 'react';
import {View, useWindowDimensions, Text} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {TabBar, TabBarIndicator} from 'react-native-tab-view';
import {CollapsibleHeaderTabView} from 'react-native-tab-view-collapsible-header';
import tw from 'twrnc';

export default function Tabs(props) {
  const {
    renderScene,
    routes,
    style,
    scrollEnabled = false,
    center = false,
    header = (
      <>
        <Text />
      </>
    ),
  } = props;

  const [index, setIndex] = React.useState(0);

  const renderTabBar = props => (
    <TabBar
      {...props}
      scrollEnabled={scrollEnabled}
      indicatorStyle={{...tw.style('bg-[#299eff]')}}
      labelStyle={tw.style(
        'text-black font-semibold capitalize text-center text-12px',
      )}
      style={{
        ...tw.style(
          'bg-white shadow-md rounded-xl text-black mb-4 py-2 flex-1',
        ),
        ...(center ? {alignItems: 'center', justifyContent: 'center'} : {}),
        ...style,
      }}
      activeColor={'#299eff'}
      indicatorContainerStyle={tw.style('')}
      tabStyle={tw.style(`${scrollEnabled && 'w-auto'} p-5px flex-1`)}
      renderIndicator={indicatorProps => {
        const width = indicatorProps.getTabWidth(0) - 10;
        return (
          <TabBarIndicator
            {...indicatorProps}
            width={width}
            style={tw.style('ml-5px mb-1px bg-[#299eff] rounded-full')}
          />
        );
      }}
    />
  );

  return (
    <CollapsibleHeaderTabView
      renderScrollHeader={() => header}
      renderTabBar={renderTabBar}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      indicatorStyle={tw.style('bg-white')}
    />
  );
}
