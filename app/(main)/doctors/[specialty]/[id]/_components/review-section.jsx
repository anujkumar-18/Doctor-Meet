"use client";

import { useState } from "react";
import { Star, MessageSquare, User, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitReview } from "@/actions/reviews";
import { toast } from "sonner";
import { format } from "date-fns";

export function ReviewSection({ doctorId, reviews: initialReviews = [] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("doctorId", doctorId);
      formData.append("rating", rating.toString());
      formData.append("comment", comment);

      const result = await submitReview(formData);

      if (result.success) {
        toast.success("Review submitted successfully!");
        setComment("");
        // Optimistically add the review if we had patient info, 
        // but it's better to just re-fetch or rely on revalidation.
        // For simplicity, we'll just wait for the user to refresh or use the return data.
      } else {
        toast.error(result.error || "Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-emerald-900/20">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            Patient Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Submit Review Form */}
          <form onSubmit={handleSubmit} className="space-y-4 bg-muted/20 p-4 rounded-lg border border-emerald-900/20">
            <h4 className="text-white font-medium">Leave a Review</h4>
            <div className="flex items-center gap-2">
              <Label>Rating:</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                    }`}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Your Comment</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience with this doctor..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-background border-emerald-900/20"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Submit Review
            </Button>
          </form>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="border-b border-emerald-900/10 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-900/20 flex items-center justify-center">
                        {review.patient?.imageUrl ? (
                          <img src={review.patient.imageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-emerald-400" />
                        )}
                      </div>
                      <span className="text-white font-medium">{review.patient?.name || "Patient"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(review.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No reviews yet. Be the first to share your experience!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
