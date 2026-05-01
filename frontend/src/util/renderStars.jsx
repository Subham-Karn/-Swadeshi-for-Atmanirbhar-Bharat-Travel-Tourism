import { Star, StarHalf } from "lucide-react";
export const renderStars = (rating, size = 16, color = "#f97316") => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  // 1. Add Full Stars
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Star key={`full-${i}`} size={size} fill={color} stroke={color} />
    );
  }

  // 2. Add Half Star if needed
  if (hasHalfStar) {
    stars.push(
      <div key="half" className="relative">
        {/* Gray star background */}
        <Star size={size} className="text-slate-200" fill="currentColor" />
        {/* Half star overlay */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
          <Star size={size} fill={color} stroke={color} />
        </div>
      </div>
    );
  }

  // 3. Add Empty Stars to complete the 5-star set
  const emptyStars = 5 - stars.length;
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Star key={`empty-${i}`} size={size} className="text-slate-200" fill="transparent" />
    );
  }

  return stars;
};