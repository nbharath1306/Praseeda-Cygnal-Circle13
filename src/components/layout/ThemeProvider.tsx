import { getTheme } from "@/lib/themes";

export function ThemeProvider({
  themeId,
  children,
}: {
  themeId?: string;
  children: React.ReactNode;
}) {
  const theme = getTheme(themeId);

  return (
    <div style={theme.vars as React.CSSProperties}>
      {children}
    </div>
  );
}
