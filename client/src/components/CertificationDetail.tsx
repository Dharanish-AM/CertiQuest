import { Certification } from "@/types/certification";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DollarSign, Calendar, CheckCircle2, Star, Bookmark, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
        </div>
      </DialogContent>
    </Dialog>
  );
}
