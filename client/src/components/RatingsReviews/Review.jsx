import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import ModalPhotoWindow from './ModalPhotoWindow.jsx';
import StarRating from '../sharedComponents/StarRating.jsx';
import ModalWindow from '../sharedComponents/ModalWindow.jsx';

import Requests from '../../../../lib/RatingsReviews.js';

// import './styles/Review.css';

const Review = ({ review }) => {
  const [showMoreText, setShowMoreText] = useState(false);
  const [showMoreTextButton, setShowMoreTextButton] = useState(true);

  const id = review.review_id;
  const date = new Date(review.date).toDateString().split(' ').slice(1).join(', ');
  const name = review.reviewer_name;
  const rating = review.rating || 0;
  const slicedSummary = _.slice(review.summary, 0, 60);
  const restOfSummary = review.summary <= 60 ? null : _.slice(review.summary, 60);
  const body = !showMoreText ? _.slice(review.body, 0, 60) : review.body;
  const showMoreButton = <button onClick = { () => {
    setShowMoreText(!showMoreText);
    setShowMoreTextButton(!showMoreTextButton);
  } } >More PLEASE</button>;

  const helpfulReview = (id) => {
    Requests.updateHelpfulReview(id)
      .then((data) => {
        console.log('helpful', data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const reportReview = (id) => {
    console.log('Report');
    Requests.reportReview(id)
      .then((data) => {
        console.log('report', data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className = 'review'>
      <div className = 'row'>
        <StarRating numberOfStars = { rating } />
        <div className = 'nameData'>{name}{date}</div>
      </div>

      <div>{slicedSummary}</div>

      {restOfSummary.length > 0 && <div> {'...' + restOfSummary} </div>}

      {review.recommend && <div>I recommend this</div>}

      <div>{body}{review.body.length > 60 && showMoreTextButton && showMoreButton}</div>

      {review.response && <div className = 'response'>{review.response}</div>}

      <div>
        { review.photos &&
          <div className = 'photoThumbsnail'>
            {
              _.map(review.photos, (photo) => {
                return (
                  <ModalPhotoWindow
                    key = { photo.id }
                    photoURL = { photo.url }
                  />
                );
              })
            }
          </div>
        }
      </div>

      <div className='row'>
        <div className = 'helpfulness'>Was this review helpful?
          <u onClick = {
            () => {
              helpfulReview(id);
            }
          }>Yes
          </u>
          ({review.helpfulness})
        </div>

        <div className = 'report'>
          <u onClick = {
            () => {
              reportReview(id);
            }
          }>Report
          </u>
        </div>
      </div>
    </div>
  );
};

Review.propTypes = {
  review: PropTypes.object.isRequired
};

export default Review;