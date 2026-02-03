"use client";

import { useApp } from "@/contexts/AppContext";
import { getTranslation } from "@/lib/i18n";

export default function About() {
  const { language } = useApp();
  const t = getTranslation(language);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4 text-[#EB0000] pb-3 border-b-2 border-[#EB0000]">{t.about.title}</h1>

        <div className="bg-card p-6 shadow-sm">
          <div className="space-y-4 text-base leading-relaxed text-foreground">
            <p>{t.about.intro}</p>

            <p>{t.about.history}</p>

            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t.about.features}</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-4">
                <li>{t.about.feature1}</li>
                <li>{t.about.feature2}</li>
                <li>{t.about.feature3}</li>
                <li>{t.about.feature4}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t.about.github}</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-4">
                <li>
                  {t.about.githubFrontend}
                  <a
                    href="https://github.com/nk2028/yindian"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    https://github.com/nk2028/yindian
                  </a>
                </li>
                <li>
                  {t.about.githubBackend}
                  <a
                    href="https://github.com/nk2028/yindian-server"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    https://github.com/nk2028/yindian-server
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t.about.relatedProjects}</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-4">
                <li>
                  <a
                    href="https://github.com/osfans/MCPDict"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    {t.about.relatedApp}
                  </a>
                </li>
                <li>
                  <a
                    href="https://mcpdict.vear.vip/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    {t.about.relatedWeiEr}
                  </a>
                  : {t.about.relatedWeiErDesc}
                  <ul className="list-[circle] list-inside ml-6">
                    <li className="my-1.5">
                      {t.about.githubFrontend}
                      <a
                        href="https://github.com/vearvip/mcpdict-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EB0000] hover:underline">
                        https://github.com/vearvip/mcpdict-frontend
                      </a>
                    </li>
                    <li className="my-1.5">
                      {t.about.githubBackend}
                      <a
                        href="https://github.com/vearvip/mcpdict-backend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EB0000] hover:underline">
                        https://github.com/vearvip/mcpdict-backend
                      </a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a
                    href="https://dialects.yzup.top"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    {t.about.relatedBuJi}
                  </a>
                  : {t.about.relatedBuJiDesc}
                  <ul className="list-[circle] list-inside ml-6">
                    <li className="my-1.5">
                      {t.about.githubFrontend}
                      <a
                        href="https://github.com/jengzang/dialects-js-frontend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EB0000] hover:underline">
                        https://github.com/jengzang/dialects-js-frontend
                      </a>
                    </li>
                    <li className="my-1.5">
                      {t.about.githubBackend}
                      <a
                        href="https://github.com/jengzang/dialects-backend"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#EB0000] hover:underline">
                        https://github.com/jengzang/dialects-backend
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

            <p>
              {t.about.iconCredit}{" "}
              <a
                href="https://github.com/ayaka14732"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EB0000] hover:underline">
                https://github.com/ayaka14732
              </a>
            </p>

            <p>
              {t.about.manusCredit}{" "}
              <a
                href="https://manus.im"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#EB0000] hover:underline">
                https://manus.im
              </a>
            </p>

            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">{t.about.feedback}</h3>
              <ul className="list-disc list-inside space-y-1.5 ml-4">
                <li>
                  {t.about.feedbackGithub}:{" "}
                  <a
                    href="https://github.com/nk2028/yindian/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    https://github.com/nk2028/yindian/issues
                  </a>
                </li>
                <li>
                  {t.about.feedbackTelegram}
                  <a
                    href="https://t.me/nk2028"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EB0000] hover:underline">
                    https://t.me/nk2028
                  </a>
                </li>
                <li>
                  {t.about.feedbackEmail}
                  <a href="mailto:support@nk2028.shn.hk" className="text-[#EB0000] hover:underline">
                    support@nk2028.shn.hk
                  </a>
                </li>
                <li>{t.about.feedbackQQ}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
