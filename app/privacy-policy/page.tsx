import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | KNLTC",
  description:
    "Privacy Policy for KNLTC (Japan Education & Career Consultancy) covering data collection, cookies, Meta Pixel usage, third-party sharing, and user rights.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 text-gray-800">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
        Privacy Policy
      </h1>
      <p className="text-sm text-gray-500 mb-10">
        Last updated: September 5, 2026
      </p>

      <div className="space-y-6 leading-relaxed">
        <p>
          KNLTC (Japan Education &amp; Career Consultancy) (&quot;KNLTC&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the
          website knltc.com (the &quot;Site&quot;). This Privacy Policy
          explains how we collect, use, disclose, and safeguard your
          information when you visit our Site, including information
          collected through advertising technologies such as the Meta
          (Facebook) Pixel. By using our Site, you agree to the collection
          and use of information in accordance with this policy.
        </p>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            1. Information We Collect
          </h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Personal Information:</span> Name,
              email address, phone number, and any other information you
              voluntarily provide when filling out a contact form,
              consultation request, or inquiry on our Site.
            </li>
            <li>
              <span className="font-medium">Usage Data:</span> Information
              your browser sends automatically, such as your IP address,
              browser type, device type, pages visited, time spent on pages,
              and referring website addresses.
            </li>
            <li>
              <span className="font-medium">Cookies and Tracking Data:</span>{" "}
              Data collected through cookies, pixels, and similar tracking
              technologies, as described in Section 3 below.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            2. How We Use Your Information
          </h2>
          <p>We use the collected information for purposes including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Responding to your inquiries and consultation requests</li>
            <li>
              Providing information about our Japan education, work, and
              visa consultancy services
            </li>
            <li>Improving our Site, content, and user experience</li>
            <li>
              Measuring and analyzing the effectiveness of our advertising
              campaigns, including Facebook and Instagram ads
            </li>
            <li>
              Showing you relevant advertisements on Facebook, Instagram,
              and other Meta platforms based on your interaction with our
              Site
            </li>
            <li>Complying with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            3. Cookies and the Meta (Facebook) Pixel
          </h2>
          <p>
            Our Site uses cookies and similar tracking technologies,
            including the <span className="font-medium">Meta Pixel</span>{" "}
            (formerly known as the Facebook Pixel), to deliver, measure, and
            improve the relevance of our advertisements.
          </p>
          <p>The Meta Pixel allows us to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Track visitor actions on our Site (such as page views and form
              submissions) after they view or click on one of our Facebook
              or Instagram ads
            </li>
            <li>
              Build targeted audiences for future advertising campaigns,
              including &quot;Custom Audiences&quot; and
              &quot;Lookalike Audiences&quot;
            </li>
            <li>
              Measure and analyze the performance of our advertising
              campaigns
            </li>
          </ul>
          <p>
            The Meta Pixel collects data such as your IP address, device
            information, browser type, pages visited, and actions taken on
            our Site. This data may be linked to your Facebook account if
            you are logged into Facebook, and is shared with Meta Platforms,
            Inc. in accordance with Meta&apos;s own data policies. We do not
            control how Meta uses this data beyond providing it for
            advertising and analytics purposes.
          </p>
          <p>
            You can learn more about how Meta collects and processes data by
            reviewing the{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Meta Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://www.facebook.com/policies/cookies/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Cookies Policy
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            4. Third-Party Sharing
          </h2>
          <p>
            We may share your information with trusted third parties who
            assist us in operating our Site, conducting our business, or
            servicing you, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Meta Platforms, Inc.</span>{" "}
              (Facebook and Instagram), for advertising and analytics
              purposes via the Meta Pixel
            </li>
            <li>
              Analytics providers used to understand how visitors use our
              Site
            </li>
            <li>
              Service providers who help us with hosting, communications, or
              customer support
            </li>
          </ul>
          <p>
            We do not sell your personal information to third parties. Any
            third parties we work with are required to handle your
            information securely and only for the purposes we specify.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            5. Your Rights and Opt-Out Options
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Request access to, correction of, or deletion of your personal
              information by contacting us using the details in Section 8
            </li>
            <li>
              Opt out of interest-based advertising from Meta by adjusting
              your{" "}
              <a
                href="https://www.facebook.com/settings?tab=ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Facebook Ad Preferences
              </a>
            </li>
            <li>
              Opt out of certain third-party tracking through the{" "}
              <a
                href="https://optout.aboutads.info/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Digital Advertising Alliance
              </a>{" "}
              or{" "}
              <a
                href="https://www.youronlinechoices.eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Your Online Choices
              </a>{" "}
              (EU)
            </li>
            <li>
              Disable cookies through your browser settings at any time,
              though this may affect Site functionality
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            6. Data Security
          </h2>
          <p>
            We implement reasonable administrative, technical, and physical
            safeguards to protect your personal information. However, no
            method of transmission over the internet or electronic storage
            is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            7. Children&apos;s Privacy
          </h2>
          <p>
            Our Site is not directed at children under the age of 13, and we
            do not knowingly collect personal information from children
            under 13. If you believe we have inadvertently collected such
            information, please contact us so we can remove it.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            8. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy or wish to
            exercise your data rights, please contact us at:
          </p>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 space-y-1">
            <p className="font-medium text-gray-900">
              KNLTC (Japan Education &amp; Career Consultancy)
            </p>
            <p>Sky View Trade Valley, (8th Floor)</p>
            <p>66/1 V.I.P Road, Naya Paltan, Dhaka 1000, Bangladesh</p>
            <p>
              Email:{" "}
              <a
                href="mailto:contact.knltc@gmail.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                contact.knltc@gmail.com
              </a>
            </p>
            <p>
              Phone:{" "}
              <a
                href="tel:+8801805013633"
                className="text-blue-600 underline hover:text-blue-800"
              >
                +880 1805 013633
              </a>
            </p>
            <p>
              Website:{" "}
              <a
                href="https://knltc.com"
                className="text-blue-600 underline hover:text-blue-800"
              >
                knltc.com
              </a>
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-900">
            9. Changes to This Policy
          </h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes
            will be posted on this page with an updated &quot;Last
            updated&quot; date. We encourage you to review this page
            periodically.
          </p>
        </section>
      </div>
    </div>
  );
}
