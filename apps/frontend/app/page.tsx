import VerificationLanding from "./_components/VerificationLanding";

export default function Home() {
  if (process.env.NEXT_PUBLIC_VERIFICATION_MODE === "true") {
    return <VerificationLanding />;
  }

  // ====== konten landing aslimu di bawah ini ======
  return (
    <div>
      {/* Konten asli kamu di sini */}
    </div>
  );
}
