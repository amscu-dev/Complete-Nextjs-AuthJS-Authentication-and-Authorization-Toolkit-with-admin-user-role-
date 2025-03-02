import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Definirea Schemei

const userSchema = z.object({
  firstName: z.string().optional(), // optional
  email: z.string().email(),
  isMarried: z.boolean().nullable(), // poate fi null
  isMan: z.boolean().nullish(), // accepta null sau undefined
  profileUrl: z.string().url(),
  age: z.number().min(1),
  friends: z.array(z.string()).max(3),
  settings: z.object({
    isSubscribed: z.boolean(),
  }),
});

// Definirea unei tipologii TypeScript bazate pe Zod

type User = z.infer<typeof userSchema>;

const user: User = {
  firstName: "Alexandru",
  email: "gigi@gmail.com",
  isMarried: false,
  isMan: undefined,
  profileUrl: "https://google.com",
  age: 26,
  friends: ["a", "b", "c"],
  settings: {
    isSubscribed: true,
  },
};

// Verificarea datelor cu zod (verificam daca un obiect respecta structura si tipologia datelor impusa de ZOD)

// Parse ne va arunca o ZodError in cazul in care validarea nu reuseste:
console.log(userSchema.parse(user));
// SafeParse ne va arunca un success/error object in functie de rezultatul validarii
console.log(userSchema.safeParse(user));

function ZodTutorial() {
  // React Hook Form Validateaza Automat Form-ul cu ajutorul ZOD
  const form = useForm<User>({
    resolver: zodResolver(userSchema),
  });
  // Putem perfoma si noi valdiarea de date in functii
  function handleSubmit(data: User) {
    const validation = userSchema.safeParse(data);
    if (validation.success) {
      // Handle Success
    } else {
      // Handle Error
    }
  }
  return <div></div>;
}

export default ZodTutorial;
