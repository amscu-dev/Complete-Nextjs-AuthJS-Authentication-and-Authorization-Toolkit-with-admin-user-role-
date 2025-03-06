"use client";
import { newVerification } from "@/actions/new-verification-action";
import CardWrapper from "@/components/auth/card-wrapper";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import FormError from "../form-error";
import FormSuccess from "../form-success";

function NewVerificationForm() {
  // Stările pentru mesaje de eroare și succes
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  // Obține parametrul token din URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Funcția care este apelată pentru a trimite cererea de verificare
  const onSubmit = useCallback(() => {
    // Dacă există deja un mesaj de succes sau eroare, nu mai trimite cererea
    if (success || error) return;

    // Verifică dacă token-ul există, altfel setează o eroare
    if (!token) {
      setError("Missing token!");
      return;
    }

    // Apelează funcția newVerification cu token-ul
    newVerification(token)
      .then((data) => {
        // Setează mesajul de succes sau eroare pe baza răspunsului
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        // În cazul unei erori în procesul de verificare
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  // Folosește useEffect pentru a apela funcția onSubmit la încărcarea componentelor (first-mount)
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
}

export default NewVerificationForm;
