import { Certification, Review } from "@/types/certification";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Calendar, CheckCircle2, Star, Bookmark, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { loadReviews, saveReviews, computeAggregate } from "@/lib/reviews";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Star as StarIcon } from "lucide-react";

interface CertificationDetailProps {
  certification: Certification | null;
  isOpen: boolean;
  onClose: () => void;
  onBookmark?: (id: string) => void;
  isBookmarked?: boolean;
}

export function CertificationDetail({ 
  certification, 
  isOpen, 
  onClose, 
  onBookmark,
  isBookmarked 
}: CertificationDetailProps) {
  // Hooks must be called unconditionally
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState<number>(5);
  const [newText, setNewText] = useState<string>("");
  const [aggregate, setAggregate] = useState(() => computeAggregate([]));

  useEffect(() => {
    if (!certification) return;
    const daysUntilDeadline = formatDistanceToNow(new Date(certification.deadline), { addSuffix: true });
    // load persisted reviews from localStorage and merge with mock's list
    const persisted = loadReviews(certification.id);
    const merged = [...(certification.reviewList || []), ...persisted];
    setReviews(merged);
    setAggregate(computeAggregate(merged));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [certification?.id]);

  if (!certification) return null;

  const daysUntilDeadline = formatDistanceToNow(new Date(certification.deadline), { addSuffix: true });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{certification.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Provider Info */}
          <div>
            <p className="text-lg text-muted-foreground">{certification.provider}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline">{certification.domain}</Badge>
              {certification.credibility === 'verified' && (
                <Badge variant="verified">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
              {certification.credibility === 'trusted' && (
                <Badge variant="trusted">Trusted</Badge>
              )}
              {certification.facultyVerified && (
                <Badge variant="secondary">Faculty Approved</Badge>
              )}
            </div>
          </div>

          <Separator />

          {/* Key Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Cost</p>
                <p className="font-semibold">${certification.cost === 0 ? 'Free' : certification.cost}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-semibold">{daysUntilDeadline}</p>
              </div>
            </div>
            {certification.rating && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="font-semibold">{certification.rating}/5 ({certification.reviews} reviews)</p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3">About This Certification</h3>
            <p className="text-muted-foreground leading-relaxed">{certification.description}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="hero" 
              className="flex-1"
              onClick={() => window.open('#', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Provider Site
            </Button>
            <Button
              variant={isBookmarked ? "default" : "outline"}
              onClick={() => onBookmark?.(certification.id)}
            >
              <Bookmark className={isBookmarked ? "fill-current" : ""} />
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
          </div>
        
          <Separator />

          {/* Reviews Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Reviews</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-accent" />
                <div className="text-sm">
                  <div className="font-semibold">{aggregate.rating || '—'}/5</div>
                  <div className="text-muted-foreground text-xs">{aggregate.count} review{aggregate.count !== 1 ? 's' : ''}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {reviews.length === 0 && (
                <div className="text-sm text-muted-foreground">No reviews yet. Be the first to review this certification.</div>
              )}

              {reviews.map((r) => (
                <div key={r.id} className="flex gap-4 items-start">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">{r.userName[0]}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{r.userName}</div>
                      <div className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(r.createdAt), { addSuffix: true })}</div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center text-accent">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-accent text-accent" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">{r.text}</p>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <h4 className="font-semibold mb-2">Add your review</h4>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-start">
                  <div className="md:col-span-1">
                    <label className="text-sm text-muted-foreground">Rating</label>
                    <select
                      value={newRating}
                      onChange={(e) => setNewRating(Number(e.target.value))}
                      className="mt-2 w-full rounded-md border px-2 py-2"
                    >
                      {[5,4,3,2,1].map((n) => (
                        <option key={n} value={n}>{n} star{n>1?'s':''}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-5">
                    <label className="text-sm text-muted-foreground">Your review</label>
                    <Textarea value={newText} onChange={(e) => setNewText(e.target.value)} className="mt-2" />
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="hero"
                        onClick={() => {
                          const userName = (localStorage.getItem('userProfile') ? JSON.parse(localStorage.getItem('userProfile')!).fullName : 'You') as string;
                          const review: Review = {
                            id: 'rev_' + Date.now(),
                            userName: userName || 'You',
                            rating: newRating,
                            text: newText,
                            createdAt: new Date().toISOString(),
                          };
                          const persisted = loadReviews(certification.id);
                          const updated = [review, ...persisted];
                          saveReviews(certification.id, updated);
                          const merged = [review, ...reviews];
                          setReviews(merged);
                          setAggregate(computeAggregate(merged));
                          setNewText('');
                          setNewRating(5);
                        }}
                        disabled={!newText.trim()}
                      >
                        Submit Review
                      </Button>
                      <Button variant="ghost" onClick={() => { setNewText(''); setNewRating(5); }}>Cancel</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
