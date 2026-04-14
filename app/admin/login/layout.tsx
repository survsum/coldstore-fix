// This layout wraps ONLY the login page - no auth check here
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
