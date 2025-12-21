import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const socialLinks = [
  { id: 1, name: "Instagram", icon: FaInstagram, url: "https://instagram.com" },
  { id: 2, name: "Facebook", icon: FaFacebook, url: "https://facebook.com" },
  { id: 3, name: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com" },
];

export default function SocialLinks() {
  return (
    <div className="flex gap-4 mb-6">
      {socialLinks.map((social) => {
        const Icon = social.icon;
        return (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={social.name}
            className="hover:text-secondary"
          >
            <Icon className="text-2xl text-white" />
          </a>
        );
      })}
    </div>
  );
}