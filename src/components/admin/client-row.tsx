"use client";

import { useRouter } from "next/navigation";

type Props = {
  href: string;
  name: string;
  email: string;
  plan: string;
  joined: string;
  invited: boolean;
};

export function ClientRow({ href, name, email, plan, joined, invited }: Props) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(href)}
      className="cursor-pointer border-b border-border-soft transition-colors last:border-0 hover:bg-ground"
    >
      <td className="px-5 py-3.5 font-medium text-ink">
        {name}
        {invited && (
          <span className="ml-2 text-[12px] font-medium text-faint">
            Invited
          </span>
        )}
      </td>
      <td className="px-5 py-3.5 text-muted">{email}</td>
      <td className="px-5 py-3.5 text-muted">{plan}</td>
      <td className="px-5 py-3.5 text-muted">{joined}</td>
    </tr>
  );
}
