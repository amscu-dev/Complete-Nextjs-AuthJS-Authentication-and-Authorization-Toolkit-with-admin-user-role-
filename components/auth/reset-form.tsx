"use client";
import { resetPassword } from "@/actions/reset-password";
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
import { ResetPasswordSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormError from "../form-error";
import FormSuccess from "../form-success";
import CardWrapper from "./card-wrapper";

function ResetForm() {
  // Stările pentru procesul de resetare a parolei (pending, eroare și succes)
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  // Inițializarea formularului cu React Hook Form și validarea cu Zod
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema), // Folosește schema Zod pentru validarea datelor
    defaultValues: {
      email: "",
    },
  });

  // Funcția care este apelată la trimiterea formularului
  const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
    setError(""); // Resetează mesajul de eroare
    setSuccess(""); // Resetează mesajul de succes

    // Începe tranziția pentru a efectua cererea de resetare a parolei
    startTransition(() => {
      resetPassword(values) // Apelează funcția de resetare a parolei
        .then((data) => {
          setError(data?.error); // Setează mesajul de eroare în caz de eșec
          setSuccess(data?.success); // Setează mesajul de succes
        });
    });
  };

  return (
    <CardWrapper
      headerLabel="Forgot your password?"
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full">
            Send reset email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
}

export default ResetForm;
