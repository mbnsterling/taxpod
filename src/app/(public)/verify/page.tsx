import { Suspense } from "react";
import VerifyPageClient from "./VerifyPageClient";

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyPageClient />
    </Suspense>
  );
}
