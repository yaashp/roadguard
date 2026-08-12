import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5">
      <ShieldAlert size={40} className="text-asphalt-900/25 dark:text-mist-100/25 mb-5" />
      <h1 className="font-display font-bold text-3xl mb-2">404</h1>
      <p className="text-asphalt-900/55 dark:text-mist-100/55 mb-6">This road doesn't lead anywhere — page not found.</p>
      <Link to="/" className="btn-primary">Back to home</Link>
    </div>
  );
}
