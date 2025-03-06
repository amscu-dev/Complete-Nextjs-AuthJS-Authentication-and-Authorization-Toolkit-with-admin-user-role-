"use client";
import { login } from "@/actions/login";
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
import { LoginSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import CardWrapper from "./card-wrapper";

function LoginForm() {
  // State pentru controlul vizibilității parolei
  const [showPassword, setShowPassword] = useState(false);

  // Obține parametrul callbackUrl din URL pentru redirecționare post-login
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  // Mesaj de eroare pentru conturile OAuth nelegate
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  // State pentru controlul vizibilității codului de autentificare cu 2 factori
  const [showTwoFactor, setShowTwoFactor] = useState(false);

  // State pentru gestionarea stării de pending și tranzacții de formular
  const [isPending, startTransition] = useTransition();

  // State pentru gestionarea mesajelor de eroare și succes
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Configurarea formularului folosind React Hook Form și Zod pentru validare
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema), // Zod folosit pentru validarea datelor formularului
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Funcția care se apelează la trimiterea formularului
  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError(""); // Resetează mesajele de eroare
    setSuccess(""); // Resetează mesajele de succes
    startTransition(() => {
      // Apelează funcția de login și gestionează diversele stări
      login(values, callbackUrl)
        .then((data) => {
          // Dacă există erori, resetează formularul și setează eroarea
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          // Dacă login-ul are succes, resetează formularul și setează succesul
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }
          // Dacă necesită 2FA, setează starea pentru a arăta câmpul de 2FA
          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch((err) => {
          // Capturează erorile necunoscute și le afișează
          if (err.message !== "NEXT_REDIRECT")
            setError("Something went wrong!");
        });
    });
  };

  // Aici putem vedea obiectul cu errori aparute din validarea ZOD
  // const { errors } = form.formState;
  // Fără Zod, validarea manuală ar însemna să folosești regulile de validare direct în configurarea register() a fiecărui câmp din formular.

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      {/* ShadCN Form se ocupă de stiluri și organizare UI. */}
      <Form {...form}>
        {/* HTML <form> se ocupă de trimiterea datelor și logica de validare/trimitere a formularului. */}
        {/* form.handleSubmit(onSubmit) --> ne permite sa efectuat validarea datelor inainte de a le trimite */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        {/* {...filed} = sintaxa folosita pentru ca input sa devina un element controlat */}
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="e-mail@gmail.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            disabled={isPending}
                            placeholder="*******"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                            <span className="sr-only">
                              {showPassword ? "Hide password" : "Show password"}
                            </span>
                          </Button>
                        </div>
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">Forgot password?</Link>
                      </Button>
                      {/* Componenta este responsabila pentru randerea mesajelor de eroare provenite din validarea ZOD */}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Two Factor Code</FormLabel>
                    <FormControl>
                      {/* {...filed} = sintaxa folosita pentru ca input sa devina un element controlat */}
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="214212"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full">
            {showTwoFactor ? "Confirm" : "Login"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default LoginForm;
