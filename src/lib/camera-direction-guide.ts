export type CameraDirectionCategory = {
  title: string;
  terms: [term: string, meaning: string][];
};

export const cameraDirectionCategories: CameraDirectionCategory[] = [
  {
    title: "Câmera e movimento",
    terms: [
      ["cinematic", "tratamento de filme"],
      ["droneview", "visão aérea"],
      ["closeup", "plano próximo"],
      ["wideangle", "campo amplo"],
      ["orbit", "órbita ao redor"],
      ["dollyin", "aproximação gradual"],
      ["dollyout", "afastamento gradual"],
      ["tracking", "acompanhar sujeito"],
      ["slowmotion", "movimento lento"],
      ["timelapse", "tempo condensado"],
      ["hyperlapse", "deslocamento acelerado"],
    ],
  },
  {
    title: "Ângulo e operação",
    terms: [
      ["lowangle", "ângulo baixo"],
      ["highangle", "ângulo alto"],
      ["overhead", "vista superior"],
      ["pov", "ponto de vista"],
      ["overtheshoulder", "sobre o ombro"],
      ["establishing", "plano de estabelecimento"],
      ["rackfocus", "troca de foco"],
      ["handheld", "câmera na mão"],
      ["steadicam", "câmera estabilizada"],
      ["craneup", "grua para cima"],
      ["cranedown", "grua para baixo"],
    ],
  },
  {
    title: "Movimento e ação",
    terms: [
      ["running", "corrida"],
      ["walking", "caminhada"],
      ["turnaround", "giro do sujeito"],
      ["reveal", "revelação gradual"],
      ["entrance", "entrada em cena"],
      ["exit", "saída de cena"],
      ["freeze", "instante congelado"],
      ["speedramp", "mudança de velocidade"],
      ["bullettime", "câmera circula ação congelada"],
      ["floating", "flutuação"],
      ["falling", "queda"],
    ],
  },
  {
    title: "Luz e atmosfera",
    terms: [
      ["goldenhour", "luz dourada"],
      ["bluehour", "luz azul de crepúsculo"],
      ["neonlight", "luz neon"],
      ["moody", "atmosfera sombria"],
      ["softlight", "luz difusa"],
      ["rimlight", "luz de contorno"],
      ["silhouette", "silhueta"],
      ["spotlight", "luz concentrada"],
      ["volumetric", "raios volumétricos"],
      ["backlight", "contraluz"],
      ["nightscene", "cena noturna"],
    ],
  },
  {
    title: "Composição",
    terms: [
      ["wide", "plano aberto"],
      ["tight", "plano fechado"],
      ["minimal", "quadro limpo"],
      ["leadinglines", "linhas-guia"],
      ["ruleofthirds", "regra dos terços"],
      ["symmetry", "simetria"],
      ["foreground", "elemento em primeiro plano"],
      ["framewithinframe", "moldura dentro do quadro"],
      ["diagonal", "composição diagonal"],
      ["centered", "sujeito centralizado"],
      ["negativespace", "espaço negativo"],
    ],
  },
  {
    title: "Efeitos ópticos",
    terms: [
      ["motionblur", "desfoque de movimento"],
      ["zoomblur", "desfoque de zoom"],
      ["bokeh", "fundo com pontos suaves"],
      ["lensflare", "reflexo de lente"],
      ["vignette", "vinheta"],
      ["splittone", "tons separados"],
      ["monochrome", "monocromático"],
      ["radialblur", "desfoque radial"],
      ["prism", "refração prismática"],
      ["glitch", "distorção digital"],
      ["filmgrain", "textura de filme"],
    ],
  },
  {
    title: "Foco e profundidade",
    terms: [
      ["macro", "detalhe muito próximo"],
      ["shallowdepth", "fundo desfocado"],
      ["deepfocus", "profundidade ampla"],
      ["selectivefocus", "foco seletivo"],
      ["eyefocus", "foco nos olhos"],
      ["centerfocus", "foco central"],
      ["tunnelfocus", "atenção ao centro"],
      ["focusstack", "múltiplas distâncias nítidas"],
      ["dropfocus", "transição para foco suave"],
      ["manualfocus", "mudança de foco deliberada"],
      ["bokehshape", "bokeh com formas"],
    ],
  },
  {
    title: "Cor e gradação",
    terms: [
      ["warm", "tons quentes"],
      ["cool", "tons frios"],
      ["contrast", "contraste alto"],
      ["exposure", "exposição intencional"],
      ["saturation", "saturação forte"],
      ["desaturate", "cor dessaturada"],
      ["cinematic", "tom de cinema"],
      ["tealorange", "ciano e laranja"],
      ["vibrant", "cores vibrantes"],
      ["bw", "preto e branco"],
      ["neon", "cores neon"],
    ],
  },
];

export const cameraDirectionTermCount = cameraDirectionCategories.reduce(
  (count, category) => count + category.terms.length,
  0,
);

export const shotFramingOptions = [
  "plano médio, câmera na altura dos olhos",
  "plano geral de estabelecimento",
  "close-up íntimo",
  "plano detalhe macro",
  "ângulo baixo heroico",
  "ponto de vista da personagem",
  "plano sobre o ombro",
];

export const cameraMovementOptions = [
  "se desloca em tracking lento por trás, terminando em aproximação suave",
  "orbita suavemente em torno do sujeito",
  "permanece fixa, com a ação contida no quadro",
  "faz um dolly-in gradual até o detalhe",
  "acompanha lateralmente o movimento",
  "sobe em grua e revela o ambiente",
];

export const cameraLightingOptions = [
  "luz dourada filtrada por folhas, verdes profundos",
  "luz lateral suave e paleta dessaturada",
  "contraluz frio com névoa volumétrica",
  "luz azul de crepúsculo, sombras densas",
  "luz difusa natural e tons terrosos",
];

export const cameraMoodOptions = [
  "mistério contemplativo, realismo cinematográfico",
  "documental observacional, discreto e humano",
  "fantasia poética, textura artesanal",
  "suspense crescente, composição minimalista",
  "comercial premium, limpo e preciso",
];

export const flowProductionStages = [
  [
    "Premissa",
    "Defina público, formato, duração, promessa e sentimento. Resuma o filme em uma frase que oriente cada decisão.",
  ],
  [
    "Roteiro em batidas",
    "Gancho, progressão e payoff. Para documentário, separe fatos, fontes, lacunas e imagens ilustrativas.",
  ],
  ["Bíblia visual", "Fixe paleta, época, textura, luz, figurino, silhuetas e linguagem de câmera."],
  [
    "Personagens e referências",
    "Gere ou importe referências limpas; nomeie personagens; reutilize-os e associe cada referência à ação correta.",
  ],
  [
    "Storyboard",
    "Liste plano, intenção, sujeito, ação, ambiente, enquadramento, movimento, luz, diálogo, duração e transição.",
  ],
  [
    "Geração",
    "Configure modelo, proporção, duração, número de saídas e áudio. Gere variações e avalie cada plano isoladamente.",
  ],
  [
    "Iteração",
    "Altere uma dimensão de cada vez. Preserve o que funcionou e atualize o prompt sem empilhar instruções conflitantes.",
  ],
  [
    "Montagem e revisão",
    "Selecione os melhores takes; ajuste ritmo, som, cor, títulos e transições em edição. Confira continuidade e fatos.",
  ],
] as const;

export const flowDirectingPrinciples = [
  [
    "Direcione a mudança",
    "O início situa. O meio altera risco ou entendimento. O final entrega consequência. Use planos de estabelecimento, ação e detalhe como pontuação visual.",
  ],
  [
    "Trave identidade e estilo",
    "Reutilize referências, descreva ação em etapas e mantenha figurino, proporções, materiais e paleta estáveis. Para animar quadros, alinhe ordem de imagens e prompts.",
  ],
  [
    "Proteja o contexto",
    "Construa a narrativa com evidências. Identifique reconstruções visuais como ilustração, preserve datas e fontes e não simule imagens de arquivo como se fossem registro.",
  ],
] as const;
