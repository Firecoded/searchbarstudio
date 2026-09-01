import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { renderBrandedEmail } from "@/lib/branded-email";
import { emailGallery } from "@/lib/email-content";
import { EmailGallery } from "@/components/admin/email-gallery";
import { PageHeader } from "@/components/portal/page-header";

export default async function EmailsPage() {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect("/dashboard");

  const emails = await Promise.all(
    emailGallery.map(async (e) => {
      const content = e.build("Jane", "#");
      const { html } = await renderBrandedEmail(content.props);
      return {
        key: e.key,
        label: e.label,
        subject: content.subject,
        html,
      };
    }),
  );

  return (
    <>
      <PageHeader title="Emails" />
      <p className="max-w-[560px] text-[15px] leading-[1.55] text-muted">
        Reference copies of the automated emails clients receive. Shown with
        sample details.
      </p>
      <div className="mt-6">
        <EmailGallery emails={emails} />
      </div>
    </>
  );
}
