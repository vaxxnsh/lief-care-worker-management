const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="w-full relative">
      {/* Grid background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>

      {/* Centered content, transparent so grid shows */}
      <div className="h-screen relative z-0 flex items-center justify-center bg-transparent">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
