import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Button,
  Link,
} from "@react-email/components";
import { render } from "@react-email/render";

const color = {
  ground: "#faf6f0",
  paper: "#fffdf9",
  ink: "#241d16",
  muted: "#6f6357",
  faint: "#9a8c7b",
  accent: "#c1592f",
  border: "#ece2d4",
};

const serif = 'Georgia, "Times New Roman", serif';
const sans =
  '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Turns **bold** segments in a string into darker bold spans so paragraphs can
// emphasize a phrase without callers needing to write JSX.
function renderRich(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <span key={i} style={{ fontWeight: 600, color: color.ink }}>
        {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export type BrandedEmailProps = {
  preview: string;
  heading: string;
  // Each string becomes its own paragraph; the first usually opens "Hi Name,".
  paragraphs: string[];
  // Optional checkmark list, rendered after the paragraphs.
  bullets?: string[];
  button?: { label: string; href: string };
  note?: string;
};

function BrandedEmail({
  preview,
  heading,
  paragraphs,
  bullets,
  button,
  note,
}: BrandedEmailProps) {
  return (
    <Html>
      <Head>
        <style>{`
          @media only screen and (max-width: 480px) {
            .sb-container { padding: 0 10px !important; }
            .sb-card { padding: 24px 20px !important; }
            .sb-footer { padding: 18px 12px 0 !important; }
          }
        `}</style>
      </Head>
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: color.ground,
          margin: 0,
          padding: "32px 0",
          fontFamily: sans,
        }}
      >
        <Container
          className="sb-container"
          style={{ maxWidth: 520, margin: "0 auto", padding: "0 16px" }}
        >
          <Section style={{ padding: "4px 4px 20px" }}>
            <Text
              style={{
                fontFamily: serif,
                fontSize: 20,
                fontWeight: 600,
                color: color.ink,
                margin: 0,
              }}
            >
              Searchbar<span style={{ color: color.accent }}>Studio</span>
            </Text>
          </Section>

          <Section
            className="sb-card"
            style={{
              backgroundColor: color.paper,
              border: `1px solid ${color.border}`,
              borderRadius: 16,
              padding: 32,
            }}
          >
            <Text
              style={{
                fontFamily: serif,
                fontSize: 24,
                fontWeight: 500,
                color: color.ink,
                margin: "0 0 14px",
              }}
            >
              {heading}
            </Text>

            {paragraphs.map((p, i) => (
              <Text
                key={i}
                style={{
                  fontSize: 15,
                  lineHeight: "1.6",
                  color: color.muted,
                  margin: "0 0 14px",
                }}
              >
                {renderRich(p)}
              </Text>
            ))}

            {bullets && bullets.length > 0 && (
              <Section style={{ margin: "2px 0 8px" }}>
                {bullets.map((b, i) => (
                  <Text
                    key={i}
                    style={{
                      fontSize: 15,
                      lineHeight: "1.5",
                      color: color.muted,
                      margin: "0 0 8px",
                    }}
                  >
                    <span style={{ color: color.accent, fontWeight: 700 }}>
                      ✓
                    </span>
                    &nbsp;&nbsp;{b}
                  </Text>
                ))}
              </Section>
            )}

            {button && (
              <Section style={{ padding: "10px 0 2px" }}>
                <Button
                  href={button.href}
                  style={{
                    backgroundColor: color.accent,
                    color: "#ffffff",
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: "none",
                    padding: "12px 22px",
                    borderRadius: 10,
                  }}
                >
                  {button.label}
                </Button>
              </Section>
            )}

            {note && (
              <Text
                style={{ fontSize: 13, color: color.faint, margin: "16px 0 0" }}
              >
                {note}
              </Text>
            )}
          </Section>

          <Section className="sb-footer" style={{ padding: "20px 8px 0" }}>
            <Text style={{ fontSize: 12, color: color.faint, margin: 0 }}>
              SearchbarStudio ·{" "}
              <Link
                href="mailto:hello@searchbarstudio.com"
                style={{ color: color.faint, textDecoration: "underline" }}
              >
                hello@searchbarstudio.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Renders a branded transactional email to HTML plus a plain-text fallback.
export async function renderBrandedEmail(
  props: BrandedEmailProps,
): Promise<{ html: string; text: string }> {
  const element = <BrandedEmail {...props} />;
  const [html, text] = await Promise.all([
    render(element),
    render(element, { plainText: true }),
  ]);
  return { html, text };
}
