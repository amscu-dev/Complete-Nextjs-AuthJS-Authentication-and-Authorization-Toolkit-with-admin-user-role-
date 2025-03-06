"use client";
import { newPassword } from "@/actions/new-password";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { NewPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { z } from "zod";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import CardWrapper from "./card-wrapper";

function NewPasswordForm() {
  // Extrage "token" din parametrii URL-ului pentru a identifica cererea de resetare a parolei
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  // Hook pentru navigare, folosit pentru redirecționarea utilizatorului după resetarea parolei
  const router = useRouter();

  // Variabile de stare pentru a gestiona starea de încărcare, erorile și mesajele de succes
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Configurarea formularului cu schema de validare Zod
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema), // Folosește Zod pentru validarea formularului
    defaultValues: { password: "" }, // Valoarea implicită pentru câmpul de parolă
  });

  // Funcția care se execută la trimiterea formularului
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError(""); // Resetează orice eroare anterioară
    setSuccess(""); // Resetează orice mesaj de succes anterioar

    // Pornește tranziția pentru acțiunea asincronă
    startTransition(() => {
      // Apelează acțiunea newPassword cu valorile formularului și token-ul
      newPassword(values, token).then((data) => {
        // Setează starea de eroare sau succes pe baza răspunsului de la server
        setError(data?.error);
        setSuccess(data?.success);

        // Dacă resetarea parolei a fost cu succes, resetează formularul și redirecționează utilizatorul după 3 secunde
        if (data?.success) {
          form.reset(); // Resetează câmpurile formularului
          setTimeout(() => {
            router.push("/auth/login"); // Redirecționează utilizatorul către pagina de login
          }, 3000);
        }
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Enter a new password!"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      {/* ShadCN Form se ocupă de stiluri și organizare UI. */}
      <Form {...form}>
        {/* HTML <form> se ocupă de trimiterea datelor și logica de validare/trimitere a formularului. */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    {/* {...filed} = sintaxa folosita pentru ca input sa devina un element controlat */}
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="********"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <div className="flex items-center w-full justify-center">
            {success && !error && <BeatLoader />}
          </div>
          <Button type="submit" className="w-full">
            Reset your password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default NewPasswordForm;
