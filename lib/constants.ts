import { FileText, MailIcon, Shield, Table } from "lucide-react"
import { BsWhatsapp } from "react-icons/bs"

export const mainItems = [
  {
    title: "Organizations",
    url: "/",
    icon: Table,
    hasDropdown: false,
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: FileText,
    hasDropdown: false,
  },
]

export const supportItems = [
  {
    title: "Email",
    url: "mailto:kakshit817@gmail.com",
    icon: MailIcon,
    isPro: false,
  },
  {
    title: "Whatsapp",
    url: "https://wa.me/918439100191",
    icon: BsWhatsapp,
    isPro: false,
  },
]

export const otherItems = [
  {
    title: "Sign Out",
    url: "#",
    icon: Shield,
    hasDropdown: false,
  },
]