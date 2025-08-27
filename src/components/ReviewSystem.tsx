import React, { useState } from 'react';
import { Star, ThumbsUp, MessageCircle, Flag, User } from 'lucide-react';
import { Establishment } from '../types';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface ReviewSystemProps {
  establishment: Establishment;
  reviews?: Review[];
  onAddReview?: (review: Omit<Review, 'id' | 'date' | 'helpful'>) => void;
}

const ReviewSystem: React.FC<ReviewSystemProps> = ({ 
  establishment, 
  reviews = [],
  onAddReview 
}) => {
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: '',
    verified: false
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview) {
      onAddReview(newReview);
    }
    setNewReview({ userName: '', rating: 5, comment: '', verified: false });
    setShowAddReview(false);
  };

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
            className={`${interactive ? 'hover:scale-110 transition-transform cursor-pointer' : 'cursor-default'}`}
            disabled={!interactive}
          >
            <Star
              className={`h-5 w-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Avis et Évaluations</h3>
        <button
          onClick={() => setShowAddReview(!showAddReview)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium min-h-[44px] touch-target"
        >
          Laisser un avis
        </button>
      </div>

      {/* Résumé des évaluations */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{establishment.rating}</div>
            <div className="flex justify-center mb-1">
              {renderStars(establishment.rating)}
            </div>
            <div className="text-sm text-gray-600">{establishment.reviewCount} avis</div>
          </div>
          
          <div className="flex-1">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = Math.floor(Math.random() * establishment.reviewCount * 0.3);
              const percentage = (count / establishment.reviewCount) * 100;
              
              return (
                <div key={stars} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm text-gray-600 w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formulaire d'ajout d'avis */}
      {showAddReview && (
        <form onSubmit={handleSubmitReview} className="bg-blue-50 rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Votre avis sur {establishment.name}</h4>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre note
            </label>
            {renderStars(newReview.rating, true, (rating) => 
              setNewReview(prev => ({ ...prev, rating }))
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre nom
            </label>
            <input
              type="text"
              value={newReview.userName}
              onChange={(e) => setNewReview(prev => ({ ...prev, userName: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Votre nom"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre commentaire
            </label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Partagez votre expérience..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowAddReview(false)}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
            >
              Publier l'avis
            </button>
          </div>
        </form>
      )}

      {/* Liste des avis */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun avis pour le moment</p>
            <p className="text-sm">Soyez le premier à laisser un avis !</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{review.userName}</span>
                      {review.verified && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          Vérifié
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderStars(review.rating)}
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-1">
                  <Flag className="h-4 w-4" />
                </button>
              </div>
              
              <p className="text-gray-700 mb-3">{review.comment}</p>
              
              <div className="flex items-center space-x-4 text-sm">
                <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600 transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Utile ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSystem;