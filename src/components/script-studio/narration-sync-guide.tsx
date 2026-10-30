import { BookOpen } from "lucide-react";

export function NarrationSyncGuide({ t }: { t: (source: string) => string }) {
  return (
    <details className="group rounded-xl border border-border bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 marker:hidden sm:p-5">
        <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
          <BookOpen className="size-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold">
            {t("Guia de sincronização de narração e timestamps")}
          </span>
          <span className="mt-0.5 block text-xs text-muted-foreground">
            {t("Áudio primeiro, marcação de tempo e geração de cenas")}
          </span>
        </span>
        <span aria-hidden="true" className="text-muted-foreground transition group-open:rotate-180">
          ▾
        </span>
      </summary>

      <article className="space-y-6 border-t border-border px-4 py-5 text-sm sm:px-6">
        <p className="max-w-4xl text-muted-foreground">
          Este guia estabelece o método de produção audiovisual baseado na premissa “o áudio comanda
          o vídeo” (<i>audio-first workflow</i>). Ele aborda a dessincronização entre voz e imagem
          ao usar ferramentas de IA generativa como Kling, Runway, Luma, Sora e Hailuo.
        </p>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">1. Por que o vídeo não sincroniza sozinho?</h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              Modelos generativos trabalham com blocos temporais rígidos, normalmente de 5 ou 10
              segundos. A fala humana varia com respirações, pausas dramáticas e inflexões.
            </li>
            <li>
              Gerar os clipes antes do áudio pode forçar o editor a esticar, acelerar ou cortar a
              locução, prejudicando o ritmo.
            </li>
            <li>
              O guia parte da premissa de que o modelo não sincroniza automaticamente a ação física
              do vídeo com uma faixa de áudio externa enviada no prompt.
            </li>
          </ul>
          <p className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-muted-foreground">
            A solução proposta é criar primeiro uma faixa-guia de áudio (<i>scratch track</i>) e
            montar as imagens e os clipes a partir dela.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">2. O fluxo de produção em 5 etapas</h2>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
            {[
              "1. Roteiro textual",
              "2. Gravação da voz",
              "3. Timestamps na timeline",
              "4. Geração dos clipes (I2V)",
              "5. Montagem e ajuste",
            ].map((step) => (
              <div
                key={step}
                className="rounded-lg border border-border bg-muted/30 p-3 text-xs font-medium"
              >
                {step}
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Etapa 1: redação com marcação de pausas</h2>
          <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
            <li>Indique pausas dramáticas e de respiração.</li>
            <li>Prefira frases diretas e pontuadas a orações subordinadas longas.</li>
          </ul>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed text-foreground">
            {`[NARRADOR (OFF)]:
Dentro da sua cabeça existe a máquina mais complexa do universo.
[PAUSA - 1.5s]
E ela está prestes a mudar.`}
          </pre>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Etapa 2: gravação da faixa-guia ou locução final
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Voz própria ou locutor:</strong> grave a leitura
              completa antes de renderizar imagens ou vídeos finais, respeitando a entonação e a
              velocidade realmente pretendidas.
            </li>
            <li>
              <strong className="text-foreground">Síntese de voz por IA:</strong> ajuste pausas com
              reticências ou tags de silêncio até o ritmo soar orgânico e fluido.
            </li>
            <li>
              Não tente acertar a duração de cabeça: priorize uma leitura agradável; os tempos
              exatos serão medidos depois.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Etapa 3: mapeamento de timestamps na timeline</h2>
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground">
            <li>
              Importe o áudio unificado na faixa A1 do editor, como DaVinci Resolve, Premiere Pro,
              CapCut, Reaper ou Audacity.
            </li>
            <li>
              Durante a reprodução, pressione M nos pontos em que cada cena deve começar e terminar.
            </li>
            <li>Leia o timecode inicial e final e calcule a duração líquida de cada intervalo.</li>
            <li>
              Preencha a tabela técnica do roteiro com o tempo real e a ação visual necessária.
            </li>
          </ol>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Cena</th>
                  <th className="px-3 py-2">Timecode real</th>
                  <th className="px-3 py-2">Duração exata</th>
                  <th className="px-3 py-2">Ação visual necessária</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">01</td>
                  <td className="px-3 py-2 font-mono">00:00,00 - 00:06,40</td>
                  <td className="px-3 py-2">6,4 s</td>
                  <td className="px-3 py-2">
                    Partícula pulsa e revela a teia com zoom out contínuo
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">02</td>
                  <td className="px-3 py-2 font-mono">00:06,40 - 00:10,20</td>
                  <td className="px-3 py-2">3,8 s</td>
                  <td className="px-3 py-2">
                    Corte seco para a frase centralizada em tipografia cinética
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">03</td>
                  <td className="px-3 py-2 font-mono">00:10,20 - 00:18,30</td>
                  <td className="px-3 py-2">8,1 s</td>
                  <td className="px-3 py-2">
                    Arquivo P&amp;B de computadores antigos e rebaixamento de som
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">
            Etapa 4: planejamento da geração de vídeo por IA
          </h2>
          <h3 className="font-semibold">Regra: sobra é melhor que falta</h3>
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-lg border border-border p-3">
              <h4 className="font-semibold">Cena de 3,8 segundos</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Gere o bloco padrão de 5 segundos e corte os 1,2 segundos excedentes no ponto em que
                começa a próxima narração.
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <h4 className="font-semibold">Cena de 6,4 segundos — extensão</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Gere 5 segundos e use <i>extend / continue video</i> a partir do último quadro para
                adicionar cerca de 4 a 5 segundos, formando um clipe de aproximadamente 9 segundos.
                Corte em 6,4 segundos na montagem.
              </p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <h4 className="font-semibold">Cena de 6,4 segundos — velocidade</h4>
              <p className="mt-1 text-xs text-muted-foreground">
                Para movimento fluido, aplique redução de velocidade para 80% com interpolação de
                fluxo óptico; 5 segundos passam a aproximadamente 6,25 segundos.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Etapa 5: montagem final e sincronização</h2>
          <ol className="list-decimal space-y-2 pl-5 text-muted-foreground">
            <li>
              <strong className="text-foreground">Trave a faixa de áudio:</strong> depois de aprovar
              o tempo da fala, não mova a faixa de voz; adapte o vídeo a ela.
            </li>
            <li>
              <strong className="text-foreground">Corte na cabeça do tempo:</strong> alinhe cortes
              visuais ao início de falas de impacto ou ao compasso da trilha.
            </li>
            <li>
              <strong className="text-foreground">Use pausas ativas:</strong> em pausas de 2
              segundos, deixe a cena respirar com micro-ações, como uma gota caindo, vento nas
              folhas ou um cursor piscando; eleve ligeiramente o SFX.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">3. Matriz de correção de problemas comuns</h2>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Problema</th>
                  <th className="px-3 py-2">Causa raiz</th>
                  <th className="px-3 py-2">Solução prática</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">A fala termina antes da mudança de cena</td>
                  <td className="px-3 py-2">O clipe ficou longo para a frase.</td>
                  <td className="px-3 py-2">
                    Corte no fim da última sílaba ou insira um B-roll de transição.
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">A frase seguinte começa sobre a cena anterior</td>
                  <td className="px-3 py-2">O corte passou do marcador de áudio.</td>
                  <td className="px-3 py-2">
                    Alinhe a borda do take ao início da forma de onda seguinte.
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">O vídeo gerado acaba antes da fala</td>
                  <td className="px-3 py-2">
                    A locução precisava de 7 segundos e o modelo gerou 5.
                  </td>
                  <td className="px-3 py-2">
                    Estenda o vídeo, insira um plano de corte ou use Optical Flow a 75–80%.
                  </td>
                </tr>
                <tr className="border-t border-border">
                  <td className="px-3 py-2">A locução soa apressada</td>
                  <td className="px-3 py-2">Texto demais para um clipe fixo de 5 segundos.</td>
                  <td className="px-3 py-2">
                    Grave primeiro em ritmo natural (cerca de 2 palavras por segundo); reduza o
                    texto ou estenda a cena.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">4. Checklist rápido de produção</h2>
          <ul className="space-y-2">
            {[
              "Roteiro finalizado com texto limpo na coluna de áudio.",
              "Áudio (locução ou IA) gravado no ritmo natural definitivo.",
              "Áudio importado na timeline do editor com marcadores M colocados.",
              "Tabela do roteiro preenchida com as durações líquidas reais (ex.: 4,2 s; 6,8 s).",
              "Cenas geradas por IA com sobra para recorte na edição.",
              "Edição finalizada com a faixa de voz travada como âncora rítmica.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 rounded border border-border"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </details>
  );
}
