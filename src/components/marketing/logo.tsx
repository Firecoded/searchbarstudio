import Image from "next/image";
import lockup from "../../../public/logo-lockup.png";
import lockupDark from "../../../public/logo-lockup-dark.png";

export function Logo({
  dark = false,
  className = "",
}: {
  dark?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={dark ? lockupDark : lockup}
      alt="SearchbarStudio"
      priority
      className={`w-auto ${className}`}
    />
  );
}
