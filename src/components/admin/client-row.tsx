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
      <td className="whitespace-nowrap px-5 py-3.5 font-medium text-ink">
        {name}
      </td>
      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{email}</td>
      <td className="whitespace-nowrap px-5 py-3.5 text-muted">{plan}</td>
      <td className="whitespace-nowrap px-5 py-3.5">
        {invited ? (
          <span className="inline-flex items-center rounded-full bg-sand px-2.5 py-1 text-[12px] font-semibold text-muted">
            Invited
          </span>
        ) : (
          <span className="text-muted">Joined {joined}</span>
        )}
      </td>
    </tr>
  );
}
