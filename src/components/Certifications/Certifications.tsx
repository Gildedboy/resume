import "./Certifications.css";

type Certification = {
  name: string;
  status: string;
};

type CertificationsProps = {
  certifications: Certification[];
};

export default ({ certifications }: CertificationsProps) => (
  <ul className="certifications">
    {certifications.map((certification, key) => (
      <li key={key}>
        <b>{certification.name}</b>
        <span>{certification.status}</span>
      </li>
    ))}
  </ul>
);
