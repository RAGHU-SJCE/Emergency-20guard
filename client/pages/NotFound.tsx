import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertTriangle className="h-10 w-10 text-warning" />
          </div>

          <h1 className="text-6xl lg:text-8xl font-bold text-secondary mb-4">
            404
          </h1>
          <h2 className="text-2xl lg:text-3xl font-semibold text-secondary mb-6">
            Page Not Found
          </h2>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            The page you're looking for doesn't exist. It may have been moved,
            deleted, or you may have entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <Home className="h-4 w-4 mr-2" />
                Go to Homepage
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 mb-4">
              Need help? Contact our support team:
            </p>
            <a
              href="mailto:support@emergencyguard.com"
              className="text-primary hover:text-primary/80 font-medium"
            >
              support@emergencyguard.com
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
