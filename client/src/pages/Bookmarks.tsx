import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CertificationCard } from "@/components/CertificationCard";
import { CertificationDetail } from "@/components/CertificationDetail";
import { mockCertifications } from "@/data/mockCertifications";
import { Certification } from "@/types/certification";
import { ArrowLeft, Bookmark as BookmarkIcon } from "lucide-react";
import { fetchCertifications } from "@/service/certificationService";

export default function Bookmarks() {
  const navigate = useNavigate();
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [certifications, setCertifications] = useState<Certification | null>(
    null
  );

  console.log(bookmarkedIds);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCertifications();
      setCertifications(data.certifications || data);
    };
    loadData();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  const handleBookmark = (id: string) => {
    console.log(id);
    const newBookmarks = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((bid) => bid !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const bookmarkedCerts = Array.isArray(certifications)
    ? certifications
        .filter((cert) => bookmarkedIds.includes(cert._id))
        .map((cert) => ({ ...cert, bookmarked: true }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/student")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Bookmarks</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {bookmarkedCerts.length === 0 ? (
          <div className="text-center py-20">
            <BookmarkIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground mb-6">
              Start bookmarking certifications to save them for later
            </p>
            <Button onClick={() => navigate("/student")}>
              Browse Certifications
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground mb-6">
              You have {bookmarkedCerts.length} bookmarked certification
              {bookmarkedCerts.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarkedCerts.map((cert) => (
                <CertificationCard
                  key={cert._id}
                  certification={cert}
                  onBookmark={handleBookmark}
                  onClick={(id) => {
                    const cert = Array.isArray(certifications) ? certifications.find((c) => c._id === id) : null;
                    if (cert) setSelectedCert(cert);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <CertificationDetail
        certification={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        onBookmark={handleBookmark}
        isBookmarked={
          selectedCert ? bookmarkedIds.includes(selectedCert._id) : false
        }
      />
    </div>
  );
}
