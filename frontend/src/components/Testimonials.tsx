import React from 'react';
import { motion } from 'framer-motion';
import { Star, ThumbsUp } from 'lucide-react';

const reviews = [
  {
    name: 'Shoaib Shaikh Siddiqui',
    location: 'Lingsugur, Karnataka',
    rating: 5,
    date: '05-April-25',
    product: 'Tea Light Candle',
    response: true,
    quality: true,
    delivery: true,
  },
  {
    name: 'Mohammad Yunus',
    location: 'Gokak, Karnataka',
    rating: 4,
    date: '10-April-25',
    product: 'Pillar Candles',
    response: true,
    quality: true,
    delivery: false,
  },
  {
    name: 'Avinash Lashty',
    location: 'Sarhan, Himachal Pradesh',
    rating: 3,
    date: '20-December-24',
    product: '',
    note: 'Service could be better',
    response: true,
    quality: false,
    delivery: true,
  },
  {
    name: 'Yashitaa',
    location: 'India',
    rating: 5,
    date: '27-March-25',
    product: 'Jar Candle',
    response: true,
    quality: true,
    delivery: true,
  },
  {
    name: 'Tanushri Sinha',
    location: 'Mumbai, Maharashtra',
    rating: 2,
    date: '15-February-25',
    product: 'Scented Candles',
    response: false,
    quality: false,
    delivery: false,
  },
  {
    name: 'Megha Shankar Seth',
    location: 'New Delhi, Delhi',
    rating: 5,
    date: '20-December-24',
    product: 'Scented Candles',
    response: false,
    quality: false,
    delivery: false,
  },
  {
    name: 'Krithiga N',
    location: 'Chennai, Tamil Nadu',
    rating: 4,
    date: '11-November-24',
    product: 'Candle Holder',
    response: true,
    quality: true,
    delivery: true,
  },
  {
    name: 'Kolla.Akhila',
    location: 'Visakhapatnam, Andhra Pradesh',
    rating: 3,
    date: '06-November-24',
    product: 'Scented Candles',
    response: true,
    quality: true,
    delivery: false,
  },
  {
    name: 'Nidhi Verma',
    location: 'Lucknow, Uttar Pradesh',
    rating: 5,
    date: '01-January-25',
    product: 'Floating Candles',
    response: true,
    quality: true,
    delivery: true,
  },
  {
    name: 'Aman Srivastava',
    location: 'Kanpur, Uttar Pradesh',
    rating: 4,
    date: '09-January-25',
    product: 'Tea Light Candle',
    response: false,
    quality: false,
    delivery: false,
  }
];

const getRatingSummary = () => {
  const total = reviews.length;
  const counts = [0, 0, 0, 0, 0];
  let totalRating = 0;
  let response = 0, quality = 0, delivery = 0;

  reviews.forEach(r => {
    counts[r.rating - 1]++;
    totalRating += r.rating;
    if (r.response) response++;
    if (r.quality) quality++;
    if (r.delivery) delivery++;
  });

  return {
    average: (totalRating / total).toFixed(1),
    counts,
    percentages: counts.map(c => Math.round((c / total) * 100)),
    satisfaction: {
      response: Math.round((response / total) * 100),
      quality: Math.round((quality / total) * 100),
      delivery: Math.round((delivery / total) * 100),
    },
    total
  };
};

const RatingsSummary = () => {
  const { average, counts, percentages, satisfaction, total } = getRatingSummary();
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-12">
      <h3 className="text-2xl font-semibold text-[#5A4232] mb-4">Ratings & Reviews</h3>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="flex flex-col items-center md:items-start">
          <p className="text-4xl font-bold text-[#5A4232]">{average} <span className="text-2xl">/ 5</span></p>
          <div className="flex space-x-1 my-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-5 h-5 ${i < Math.round(average) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
          </div>
          <p className="text-gray-600">{total} Reviews</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center text-sm mb-1">
              <span className="w-12">{star} Star</span>
              <div className="w-full h-3 mx-2 bg-gray-200 rounded">
                <div
                  className="h-full bg-green-500 rounded"
                  style={{ width: `${percentages[star - 1]}%` }}
                ></div>
              </div>
              <span className="w-12 text-right">({percentages[star - 1]}%)</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          {['Response', 'Quality', 'Delivery'].map((label, i) => {
            const percent = satisfaction[label.toLowerCase()];
            return (
              <div key={label} className="text-center">
                <p className="font-semibold">{label}</p>
                <div className="relative w-16 h-16">
                  <svg className="absolute top-0 left-0" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6e6e6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="#3CB371"
                      strokeWidth="3"
                      strokeDasharray={`${percent}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold">
                    {percent}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-16 bg-[#F5E9DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-serif text-center text-[#5A4232] mb-12">Customer Reviews</h2>
          <RatingsSummary />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-[#5A4232]">{review.name}</h3>
                  <p className="text-sm text-gray-600">{review.location}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#C9A66B] fill-current" />
                    ))}
                  </div>
                  <p className="italic text-sm mt-1 text-gray-500">{review.date}</p>
                  {review.product && (
                    <p className="text-sm mt-1 font-semibold">
                      Product Name : <span className="font-normal">{review.product}</span>
                    </p>
                  )}
                  {review.note && <p className="text-sm italic mt-2">{review.note}</p>}
                </div>
                <div className="flex gap-4 text-sm mt-3 text-[#5A4232]">
                  {review.response && (
                    <p className="flex items-center gap-1">
                      Response <ThumbsUp className="h-4 w-4 text-green-600" />
                    </p>
                  )}
                  {review.quality && (
                    <p className="flex items-center gap-1">
                      Quality <ThumbsUp className="h-4 w-4 text-green-600" />
                    </p>
                  )}
                  {review.delivery && (
                    <p className="flex items-center gap-1">
                      Delivery <ThumbsUp className="h-4 w-4 text-green-600" />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;


