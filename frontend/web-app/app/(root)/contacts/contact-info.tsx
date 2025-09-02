import { WebInfo } from "@/types";

type Props = {
  info: WebInfo;
};
export default function ContactInfo({ info }: Props) {
  return (
    <div className="">
      <h2 className="text-4xl">{info.title}</h2>
      <span>Email: {info.email}</span>
      <br />
      <span>Phone: {info.phoneNumber}</span>
      
    </div>
  );
}
