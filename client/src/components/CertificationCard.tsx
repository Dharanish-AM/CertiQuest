import { Certification } from "@/types/certification";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bookmark, Calendar, DollarSign, Star, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CertificationCardProps {
  certification: Certification;
  onBookmark?: (id: string) => void;
  onClick?: (id: string) => void;
}

export function CertificationCard({ certification, onBookmark, onClick }: CertificationCardProps) {
  const daysUntilDeadline = formatDistanceToNow(new Date(certification.deadline), { addSuffix: true });
  const isUrgent = new Date(certification.deadline).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000;

  return (
    <Card 
      className="overflow-hidden shadow-card hover:shadow-lg transition-smooth cursor-pointer group"
      onClick={() => onClick?.(certification.id)}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-base line-clamp-1">
              {certification.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{certification.provider}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onBookmark?.(certification.id);
            }}
            className="shrink-0"
          >
            <Bookmark className={certification.bookmarked ? "fill-primary text-primary" : ""} />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
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

        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {certification.description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-foreground font-medium">
              <DollarSign className="w-4 h-4" />
              <span>{certification.cost === 0 ? 'Free' : certification.cost}</span>
            </div>
            {certification.rating && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Star className="w-4 h-4 fill-accent text-accent" />
                <span>{certification.rating}</span>
                <span className="text-xs">({certification.reviews})</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 ${isUrgent ? 'text-deadline-urgent font-medium' : 'text-muted-foreground'}`}>
            <Calendar className="w-4 h-4" />
            <span className="text-xs">{daysUntilDeadline}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
