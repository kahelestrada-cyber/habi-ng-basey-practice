import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";

// Inner routes load on demand so the landing page ships without forms, auth or Supabase.
const OrderPage = lazy(() =>
  import("@/pages/OrderPage").then((m) => ({ default: m.OrderPage })),
);
const TrackPage = lazy(() =>
  import("@/pages/TrackPage").then((m) => ({ default: m.TrackPage })),
);
const CoopPage = lazy(() =>
  import("@/pages/CoopPage").then((m) => ({ default: m.CoopPage })),
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/track" element={<TrackPage />} />
          <Route path="/track/:code" element={<TrackPage />} />
          <Route path="/coop" element={<CoopPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
