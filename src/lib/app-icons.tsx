import {
  Cloud,
  GraduationCap,
  Calendar,
  Mail,
  FileSpreadsheet,
  Users,
  HardDrive,
  Video,
  PenTool,
  Database,
  Zap,
  Package,
  Shield,
  LifeBuoy,
  Github,
  Bell,
} from "lucide-react";

/**
 * Catálogo de ferramentas "conectáveis" mostradas no site (grades de
 * integração em /ti-suporte, /mensagens e na landing page).
 *
 * IMPORTANTE: usamos apenas pictogramas genéricos (da biblioteca lucide),
 * nunca os logotipos oficiais de Google, Microsoft, Zoom, Salesforce etc.
 * Os nomes reais dos produtos aparecem como texto (é só uma referência ao
 * tipo de ferramenta), mas o ícone nunca reproduz uma marca registrada de
 * terceiros — o AtlasDesk não tem integração real com esses produtos ainda,
 * e usar o logo oficial sugeriria uma parceria que não existe.
 */
export interface AppCatalogItem {
  name: string;
  category: string;
  icon: React.ReactNode;
  tone: string;
}

export const APP_CATALOG: AppCatalogItem[] = [
  {
    name: "Google Drive",
    category: "Armazenamento",
    icon: <Cloud className="h-5 w-5" />,
    tone: "bg-blue-50 text-blue-600",
  },
  {
    name: "Google Classroom",
    category: "Pedagógico",
    icon: <GraduationCap className="h-5 w-5" />,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    name: "Google Agenda",
    category: "Produtividade",
    icon: <Calendar className="h-5 w-5" />,
    tone: "bg-sky-50 text-sky-600",
  },
  {
    name: "Gmail",
    category: "E-mail",
    icon: <Mail className="h-5 w-5" />,
    tone: "bg-red-50 text-red-600",
  },
  {
    name: "Microsoft 365",
    category: "Produtividade",
    icon: <FileSpreadsheet className="h-5 w-5" />,
    tone: "bg-fuchsia-50 text-fuchsia-600",
  },
  {
    name: "Microsoft Teams",
    category: "Videochamada",
    icon: <Users className="h-5 w-5" />,
    tone: "bg-indigo-50 text-indigo-600",
  },
  {
    name: "OneDrive",
    category: "Armazenamento",
    icon: <HardDrive className="h-5 w-5" />,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    name: "Zoom",
    category: "Videochamada",
    icon: <Video className="h-5 w-5" />,
    tone: "bg-blue-50 text-blue-700",
  },
  {
    name: "Canva",
    category: "Design",
    icon: <PenTool className="h-5 w-5" />,
    tone: "bg-purple-50 text-purple-600",
  },
  {
    name: "Sistema Acadêmico",
    category: "Secretaria",
    icon: <Database className="h-5 w-5" />,
    tone: "bg-emerald-50 text-emerald-700",
  },
  {
    name: "Automações",
    category: "Produtividade",
    icon: <Zap className="h-5 w-5" />,
    tone: "bg-amber-50 text-amber-600",
  },
  {
    name: "Armazenamento em nuvem",
    category: "Arquivos",
    icon: <Package className="h-5 w-5" />,
    tone: "bg-blue-50 text-blue-500",
  },
  {
    name: "Segurança e antivírus",
    category: "TI",
    icon: <Shield className="h-5 w-5" />,
    tone: "bg-slate-100 text-slate-700",
  },
  {
    name: "Central de ajuda",
    category: "Suporte",
    icon: <LifeBuoy className="h-5 w-5" />,
    tone: "bg-cyan-50 text-cyan-600",
  },
  {
    name: "GitHub",
    category: "TI e desenvolvimento",
    icon: <Github className="h-5 w-5" />,
    tone: "bg-neutral-100 text-neutral-700",
  },
  {
    name: "Central de incidentes",
    category: "TI",
    icon: <Bell className="h-5 w-5" />,
    tone: "bg-orange-50 text-orange-600",
  },
];

/** Atalho para pegar um subconjunto pelo nome, preservando ícone/tom. */
export function pickApps(names: string[]): AppCatalogItem[] {
  return names
    .map((n) => APP_CATALOG.find((a) => a.name === n))
    .filter((a): a is AppCatalogItem => !!a);
}
