import { getWebInfoById } from "@/lib/actions/WebInfo.actions";
import ContactInfo from "./contact-info";
import ContactForm from "./contact-form";

export default async function ContactPage() {
  const info = await getWebInfoById("1");
  return (
    <>
      <div className="flex gap-5">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245.07162058115767!2d106.48704166175773!3d10.645769272957557!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310acd0028148a8f%3A0xf9598b8f41de4ba3!2sDaily%20Coffee!5e0!3m2!1svi!2ssg!4v1756818126278!5m2!1svi!2ssg"
          width="800"
          height="450"
          loading="lazy"
        ></iframe>
        <ContactInfo info={info} />
      </div>
      <div className="my-8 space-y-2">
        <h2>Send us your feedback</h2>
        <ContactForm />
      </div>
    </>
  );
}
