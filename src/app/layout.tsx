import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://easybuild.pro"),
  title: {
    default: "EasyBuild 易构 — 企业级 Java 快速开发平台",
    template: "%s | EasyBuild 易构",
  },
  description:
    "EasyBuild 易构是面向企业级 Java 开发的快速构建平台，提供代码生成、微服务架构、ORM、缓存、消息队列等开箱即用的模块化能力，大幅提升研发效率。",
  keywords: [
    "EasyBuild",
    "易构",
    "Java快速开发",
    "企业级框架",
    "代码生成器",
    "微服务",
    "Spring Boot",
  ],
  authors: [{ name: "EasyBuild Team" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "EasyBuild 易构",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "EasyBuild 易构",
        url: "https://easybuild.mcst.com",
        description:
          "面向企业级 Java 开发的快速构建平台，提供代码生成、微服务架构、ORM、缓存、消息队列等模块化能力。",
      },
      {
        "@type": "Organization",
        name: "EasyBuild",
        url: "https://easybuild.mcst.com",
      },
    ],
  };

  return (
    <html lang="zh-CN">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
