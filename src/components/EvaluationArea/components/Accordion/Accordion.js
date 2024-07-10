import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import tw from 'twrnc';
import NoData from '../../../NoData/NoData';
import translateFocusArea from '../../../../utilities/translateFocusArea.utility';

function Accordion({content = 'content', focusArea}) {
  const {t, i18n} = useTranslation('global');

  const {
    image,
    title,
    totalInitialEvaluation,
    totalInitialAnswers,
    questions,
    totalFinalEvaluation,
    totalFinalAnswers,
  } = focusArea;

  const [expanded, setExpanded] = useState(false);

  const finalTotalScore = (totalFinalEvaluation / totalFinalAnswers).toFixed(1);
  const isTotalNaN = isNaN(finalTotalScore);
  const [translatedTitle, setTranslatedTitle] = useState(focusArea.title);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const [translatedTopicTitles, setTranslatedTopicTitles] = useState([]);

  const translateTitle = async () => {
    const title = await translateFocusArea(focusArea);
    setTranslatedTitle(title);
  };

  // Traduce los títulos de los temas (topic.title)
  const translateTopicTitles = async () => {
    const translatedTitles = await Promise.all(
      focusArea.questions.map(async topic => {
        const translatedTitle = await translateFocusArea(topic);
        return translatedTitle;
      }),
    );
    setTranslatedTopicTitles(translatedTitles);
  };

  useEffect(() => {
    translateTopicTitles();
    translateTitle();
  }, [focusArea, i18n.language]);

  return (
    <View style={tw.style('shadow-md bg-[#f8f8f8] mb-4 rounded-2xl px-2 py-4')}>
      <TouchableOpacity
        onPress={toggleExpand}
        style={tw.style('flex-row justify-between items-center')}>
        <View style={tw.style('flex-row items-center')}>
          {expanded ? (
            <Icon name="up" size={16} color="#299eff" />
          ) : (
            <Icon name="down" size={16} color="#299eff" />
          )}
          <Image
            source={{
              uri: image,
            }}
            style={tw.style('w-9 h-8 mx-2')}
          />
          <Text style={tw.style('text-[#9a9a9a] w-[50%]')}>
            {translatedTitle}
          </Text>
        </View>
        <View style={tw.style('flex-row justify-between')}>
          <View style={tw.style('mr-2 items-center')}>
            <Text style={tw.style('text-[#9a9a9a]')}>
              {t('components.evaluation.start')}
            </Text>
            <Text style={tw.style('text-[#9a9a9a]')}>
              {(totalInitialEvaluation / totalInitialAnswers).toFixed(1)}
            </Text>
          </View>
          <View style={tw.style('items-center')}>
            <Text style={tw.style('text-[#9a9a9a]')}>Final</Text>
            <Text style={tw.style('text-[#9a9a9a]')}>
              {isTotalNaN ? '-' : finalTotalScore}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {expanded && (
        <View>
          {questions.length > 0 ? (
            questions.map((topic, index) => {
              const finalScore = (
                topic.finalEvaluation / topic.finalAnswers
              ).toFixed(1);
              const isFinalNaN = isNaN(finalScore);

              return (
                <View
                  key={`question-${index}`}
                  style={tw.style('flex-row justify-between w-full my-2')}>
                  <Text style={tw.style('w-[70%] text-[#9a9a9a]')}>
                    {translatedTopicTitles[index] || topic.title}
                  </Text>
                  <View style={tw.style('flex-row justify-between')}>
                    <View style={tw.style('mr-2 items-center')}>
                      <Text style={tw.style('text-[#9a9a9a]')}>
                        {t('components.evaluation.start')}
                      </Text>
                      <Text style={tw.style('text-[#9a9a9a]')}>
                        {(
                          topic.initialEvaluation / topic.initialAnswers
                        ).toFixed(1)}
                      </Text>
                    </View>
                    <View style={tw.style('items-center')}>
                      <Text style={tw.style('text-[#9a9a9a]')}>Final</Text>
                      <Text style={tw.style('text-[#9a9a9a]')}>
                        {isTotalNaN ? '-' : finalTotalScore}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <NoData />
          )}
        </View>
      )}
    </View>
  );
}

export default Accordion;
