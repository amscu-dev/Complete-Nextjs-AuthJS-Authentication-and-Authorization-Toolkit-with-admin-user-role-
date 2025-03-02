import CardWrapper from "./card-wrapper";

function LoginForm() {
  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      Login Form!
    </CardWrapper>
  );
}

export default LoginForm;
