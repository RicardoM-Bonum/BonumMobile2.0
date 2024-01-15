import { View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { size } from 'lodash';
import { useFetchAndLoad } from '../../../../../../hooks';
import Loading from '../../../../../../components/Loading';
import { getEvaluation360ByCoacheeId } from '../../../../../../services/evaluations.service';
import { useTranslation } from 'react-i18next';
import NoData from '../../../../../../components/NoData/NoData';
import Comment from '../components/Comment';

const Comments = (props) => {
  const { type, coachee } = props;

  const { t } = useTranslation('global');

  const [comments, setComments] = useState([]);
  const { loading, callEndpoint } = useFetchAndLoad();

  const getComments = async () => {
    try {
      if (!coachee) return;
      const { data } = await callEndpoint(getEvaluation360ByCoacheeId(coachee));

      const commentsTemp = data?.data
        ?.filter((evaluation) => evaluation.evaluationType === type)
        .map((evaluation) => ({
          title: evaluation.dateSended,
          comment: evaluation.comments
        }));

      setComments(commentsTemp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  if (loading) return <Loading />;

  return (
    <View>
      {size(comments) > 0 ? (
        comments.map((comment, i) => <Comment key={i} comment={comment} />)
      ) : (
        <NoData title={t('pages.myEvaluations.noData')} />
      )}
    </View>
  );
};

export default Comments;
