import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificationCard } from "@/components/CertificationCard";
import { CertificationDetail } from "@/components/CertificationDetail";
import { Certification } from "@/types/certification";
import {
  Search,
  Filter,
  LogOut,
  Bookmark,
  Bell,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getDefaultProfile, loadProfile } from "@/lib/profile";
import { UserProfile } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { fetchCertifications } from "@/service/certificationService";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [recommendedCerts, setRecommendedCerts] = useState<Certification[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bookmarks");
    if (saved) {
      setBookmarkedIds(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchCertifications();
      setCertifications(data.certifications || data);
    };
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleBookmark = (id: string) => {
    const newBookmarks = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter((bid) => bid !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(newBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(newBookmarks));
  };

  const domains = [
    "all",
    "Cloud Computing",
    "Machine Learning",
    "Cybersecurity",
    "Data Science",
    "Networking",
  ];

  const filteredCerts = certifications
    .filter((cert) => {
      const matchesSearch =
        cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.provider.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDomain =
        domainFilter === "all" || cert.domain === domainFilter;
      return matchesSearch && matchesDomain;
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortBy === "cost") {
        return a.cost - b.cost;
      } else if (sortBy === "popularity") {
        return (b.reviews || 0) - (a.reviews || 0);
      }
      return 0;
    })
    .map((cert) => ({ ...cert, bookmarked: bookmarkedIds.includes(cert.id) }));

  // Compute simple recommendations based on profile degree + interests
  useEffect(() => {
    const profile: UserProfile = (loadProfile() ??
      getDefaultProfile("student")) as UserProfile;
    const interests: string[] = profile.interests || [];
    const degree: string = (profile.degree || "").toLowerCase();

    const scored = certifications
      .map((cert) => {
        let score = 0;
        // boost if domain matches an interest
        if (interests.includes(cert.domain)) score += 2;
        // boost if title or provider mentions degree or degree tokens
        if (
          degree &&
          (cert.title.toLowerCase().includes(degree) ||
            cert.provider.toLowerCase().includes(degree))
        )
          score += 2;
        // slight boost if domain contains degree token
        if (degree && cert.domain.toLowerCase().includes(degree)) score += 1;
        return { cert, score };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // fallback to rating
        const ra = a.cert.rating || 0;
        const rb = b.cert.rating || 0;
        return rb - ra;
      })
      .map(({ cert }) => ({
        ...cert,
        bookmarked: bookmarkedIds.includes(cert.id),
      }));

    setRecommendedCerts(scored.slice(0, 8));
  }, [bookmarkedIds, certifications]);

  const scrollCarousel = (dir: "left" | "right") => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold bg-clip-text">CertiQuest</h1>
              <nav className="hidden md:flex gap-6">
                <a
                  href="#"
                  className="text-sm font-medium text-foreground hover:text-primary transition-base"
                  onClick={(e) => e.preventDefault()}
                >
                  Directory
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-base"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/bookmarks");
                  }}
                >
                  My Bookmarks
                </a>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-base"
                  onClick={(e) => e.preventDefault()}
                >
                  Deadlines
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/bookmarks")}
              >
                <Bookmark className="w-5 h-5" />
                {bookmarkedIds.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                    {bookmarkedIds.length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
              >
                <User className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h2 className="text-4xl font-bold mb-3">
              Welcome back, Student 👋
            </h2>
            <p className="text-lg opacity-90">
              Discover verified certifications to boost your career
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="Search certifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={domainFilter} onValueChange={setDomainFilter}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain === "all" ? "All Domains" : domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deadline">Deadline (Soonest)</SelectItem>
                  <SelectItem value="cost">Cost (Low to High)</SelectItem>
                  <SelectItem value="popularity">Popularity</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-semibold">Recommended for You</h3>
            <p className="text-sm text-muted-foreground">
              Based on your degree + interests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollCarousel("left")}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => scrollCarousel("right")}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {recommendedCerts.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No recommendations yet. Update your profile to get personalized
              suggestions.
            </div>
          ) : (
            recommendedCerts.map((cert) => (
              <div
                key={cert.id}
                className="min-w-[300px] h-full max-w-[450px] flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <CertificationCard
                  certification={cert}
                  onBookmark={handleBookmark}
                  onClick={(id) => {
                    const found = certifications.find((c) => c.id === id);
                    if (found) setSelectedCert(found);
                  }}
                  aiSuggested={true}
                />
              </div>
            ))
          )}
        </div>
      </section>

      {/* Certifications Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold">
            {filteredCerts.length} Certification
            {filteredCerts.length !== 1 ? "s" : ""} Found
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline">{bookmarkedIds.length} Bookmarked</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onBookmark={handleBookmark}
              onClick={(id) => {
                const cert = certifications.find((c) => c.id === id);
                if (cert) setSelectedCert(cert);
              }}
              aiSuggested={false}
            />
          ))}
        </div>
      </section>

      <CertificationDetail
        certification={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
        onBookmark={handleBookmark}
        isBookmarked={
          selectedCert ? bookmarkedIds.includes(selectedCert.id) : false
        }
      />
    </div>
  );
}
