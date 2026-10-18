export type VisualStyle = {
  id: string;
  name: string;
  category: "animation" | "creator" | "cinema" | "retro" | "conceptual";
  categoryLabel: string;
  image: string;
  badge: string;
  vibe: string;
  keyElements: string[];
  colors: { name: string; hex: string }[];
  audioStyle: string;
  youtube: {
    primaryNiche: string;
    subNiches: string[];
    videoThemes: string[];
    referenceChannels: string[];
  };
  aiPrompt: string;
};

export const visualStyles: VisualStyle[] = [
  // ---------------- NOVO: STICKMAN HÍBRIDO (DISCIPLINA & ESTOICISMO) ----------------
  {
    id: "stickman-hybrid-discipline",
    name: "Stickman Híbrido: Disciplina, Hábitos & Estoicismo",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/stickman_discipline_monk.png",
    badge: "Fórmula Viral do Self-Improvement",
    vibe: "Motivador, reflexivo, disciplinado, resiliente e inspirador",
    keyElements: [
      "Cabeça esférica branca limpa com expressões faciais de anime (olhos expressivos, boca determinada)",
      "Cabelo despenteado pontudo estilo mangá/anime (preto ou castanho escuro)",
      "Corpo híbrido: torso com moletom streetwear (hoodie), calça cargo com bolsos e tênis detalhados",
      "Braços e pernas com a agilidade e simplicidade do traço stickman com contorno grosso e limpo",
      "Metáforas visuais clássicas de estoicismo: puxando a pedra de Sísifo com corda, treinando boxe, postura de meditação zen",
      "Fundo branco ou cinza claro estéreo com sombras de contato suaves projetadas no chão",
    ],
    colors: [
      { name: "Hoodie Charcoal", hex: "#1F2421" },
      { name: "Pants Navy Denim", hex: "#2C3E50" },
      { name: "Skin White", hex: "#FFFFFF" },
      { name: "Stone Gray", hex: "#6C757D" },
      { name: "Energy Green", hex: "#2ECC71" },
    ],
    audioStyle:
      "Trilhas sonoras de piano reflexivo com cordas crescentes (estilo Hans Zimmer ou Ludovico Einaudi), narração grave e profunda com microfone condensador Shure SM7B, e sound effects pontuais de esforço, respiração e batimentos cardíacos.",
    youtube: {
      primaryNiche: "Desenvolvimento Pessoal, Estoicismo & Hábitos",
      subNiches: [
        "Detox de Dopamina & Superação de Vícios em Telas",
        "A Rotina dos 1% (Acordar 5h, Banho Gelado, Treino Pesado)",
        "Filosofia Estoica Aplicada à Vida Moderna (Marco Aurélio, Sêneca)",
        "Como Construir Disciplina Inabalável e Foco Monástico",
      ],
      videoThemes: [
        "Como passei de fracassado a disciplinado em 6 meses (Minha História)",
        "O protocolo de dopamina que curou minha procrastinação crônica",
        "A rocha que você carrega todos os dias: a lição estoica de Sísifo",
        "Por que 99% dos homens desistem da academia no primeiro mês",
      ],
      referenceChannels: [
        "Better Than Yesterday",
        "Improvement Pill",
        "Hamza (clipes animados)",
        "Cole Hastings",
        "FarFromAverage",
        "Dan Koe (visuals)",
      ],
    },
    aiPrompt:
      "2D hybrid stickman character with spiky black anime hair, wearing black streetwear hoodie and dark cargo pants with sneakers, 4 poses sequence: celebrating, throwing a punch, pulling a heavy boulder with rope, meditating cross-legged, minimal 2D vector illustration, white background, self-improvement YouTube animation style, crisp lineart, 8k",
  },

  // ---------------- NOVO: STICKMAN HÍBRIDO (FOCO, CRIAÇÃO & PRODUTIVIDADE) ----------------
  {
    id: "stickman-hybrid-creator",
    name: "Stickman Híbrido: Foco, Criador & Produtividade Digital",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/stickman_hybrid_creator.png",
    badge: "Alto CTR em Thumbnails",
    vibe: "Produtivo, inteligente, enérgico, moderno e focado em metas",
    keyElements: [
      "Avatar carismático em 3 estados mentais: Treino físico (halteres), Trabalho intelectual (laptop + caneca + lâmpada de ideia) e Combate/Ação (luvas de boxe vermelhas)",
      "Moletom azul clássico com capuz e cordões visíveis, jeans ajustado e tênis casuais",
      "Adereços modernos de criador digital: MacBook cinza espacial, bloco de anotações com caneta, xícara de café fumegante",
      "Linhas cinéticas de velocidade (action lines) e balões de pensamento com ícones iluminados",
      "Ideal para animação modular (boneco riggeado no After Effects, Moho ou Canva)",
    ],
    colors: [
      { name: "Creator Blue", hex: "#3B82F6" },
      { name: "Boxing Glove Red", hex: "#EF4444" },
      { name: "Idea Lightbulb Yellow", hex: "#FBBF24" },
      { name: "Clean Paper White", hex: "#F9FAFB" },
      { name: "Outline Black", hex: "#111827" },
    ],
    audioStyle:
      "Batidas lofi study beats relaxantes para momentos de foco no computador, transições sonoras com swooshes de lápis e cliques de mouse, mudando para batidas eletrônicas intensas em momentos de academia e ação.",
    youtube: {
      primaryNiche: "Produtividade Digital, Estudo & Criador de Conteúdo",
      subNiches: [
        "Como Organizar sua Vida e Estudos no Notion",
        "A Rotina Diária de um Estudante de Alta Performance",
        "Equilíbrio entre Mente, Corpo e Negócios Digitais",
        "Como Aprender Qualquer Habilidade em 20 Horas",
      ],
      videoThemes: [
        "A rotina diária perfeita: como conciliar faculdade, treino e trabalho",
        "Estudei 10 horas por dia durante 30 dias (o que aconteceu com meu cérebro)",
        "Como criar seu primeiro canal no YouTube usando apenas ferramentas gratuitas",
        "O método do Caderno Preto para nunca mais esquecer o que você estuda",
      ],
      referenceChannels: [
        "Ali Abdaal (animações auxiliares)",
        "Thomas Frank",
        "Cajun Koi Academy",
        "Kharma Medic",
        "Sprouts",
      ],
    },
    aiPrompt:
      "Minimalist 2D vector stickman character with stylish spiky anime brown hair, cute expressive facial features, wearing a modern blue hoodie, dark slim pants and white sneakers, shown in 3 positions: lifting a dumbbell, writing in notebook at desk with laptop and idea lightbulb, boxing with red gloves, clean thick outlines, isolated on crisp white background, YouTube thumbnail sticker style, clip art illustration, 8k",
  },

  // ---------------- NOVO: STICKMAN ARQUÉTIPOS (MENTOR, ATLETA & HUSTLER) ----------------
  {
    id: "stickman-hybrid-archetypes",
    name: "Stickman Híbrido: Arquétipos (O Mentor, O Atleta & O Hustler)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/stickman_archetypes_mentor.png",
    badge: "Versatilidade Narrativa",
    vibe: "Sociável, contrastante, narrativo, didático e humorístico",
    keyElements: [
      "Variações claras de arquétipos humanos para enriquecer a história com múltiplos personagens:",
      "1. O Mentor / Intelectual: Cabelo penteado de lado, óculos pretos intelectuais, camisa social branca, gravata azul-marinho e livro sob o braço",
      "2. O Atleta Focado: Moletom esportivo, braços cruzados, garrafa de suplemento e halteres aos pés com expressão de determinação",
      "3. O Empreendedor / Hustler: Moletom preto e vermelho, tênis esportivos de cano alto, carregando caixas de encomendas com sorriso empolgado",
      "Design perfeito para diálogos em cena (o mentor ensinando o aluno, ou a comparação de mentalidade de pobre vs mentalidade de rico)",
    ],
    colors: [
      { name: "Executive Tie Blue", hex: "#1D4ED8" },
      { name: "Sneaker Fire Red", hex: "#DC2626" },
      { name: "Sport Cyan", hex: "#06B6D4" },
      { name: "Cardboard Kraft", hex: "#D97706" },
      { name: "Clean Suit White", hex: "#FFFFFF" },
    ],
    audioStyle:
      "Vozes com timbres e equalizações distintas para cada arquétipo (pitch mais grave e calmo para o mentor, enérgico e acelerado para o hustler), acompanhadas de trilhas dinâmicas que alternam entre comédia e seriedade.",
    youtube: {
      primaryNiche: "Finanças Pessoais, Negócios & Storytelling de Carreira",
      subNiches: [
        "Pai Rico vs Pai Pobre: Mentalidades Financeiras Contrastadas",
        "Como Começar um Negócio Online com Zero Reais",
        "Erros Clássicos de Quem Abre a Primeira Empresa",
        "Psicologia das Vendas & Relacionamentos Profissionais",
      ],
      videoThemes: [
        "A diferença exata entre como o Pobre, a Classe Média e o Rico pensam",
        "3 amigos abriram um negócio: veja onde cada um foi parar 5 anos depois",
        "O que o meu primeiro mentor milionário me ensinou em uma conversa de 15 minutos",
        "Como vender qualquer coisa para qualquer pessoa (mesmo sendo tímido)",
      ],
      referenceChannels: [
        "Practical Psychology",
        "The Swedish Investor",
        "One Minute Economics",
        "FightMediocrity",
        "Proactive Thinker",
      ],
    },
    aiPrompt:
      "Three distinct 2D hybrid stickman characters standing side by side on white background: left character as an intellectual mentor with black glasses, white dress shirt and blue tie holding a book; middle character as athletic gym enthusiast with blue hoodie and dumbbells; right character as energetic young entrepreneur carrying a cardboard box with red sneakers, clean vector cartoon lineart, YouTube animation style, 8k",
  },

  {
    id: "vox-documentary",
    name: "Documentário Dinâmico (Estilo Vox / Johnny Harris)",
    category: "creator",
    categoryLabel: "Creator Economy & Digital",
    image: "images/vox_documentary.jpg",
    badge: "Alta Retenção Educativa",
    vibe: "Analítico, investigativo, sofisticado, didático e contemporâneo",
    keyElements: [
      "Mapas 3D isométricos com relevo e rotas de luz",
      "Recortes fotográficos com paralaxe (efeito Ken Burns 2.5D)",
      "Gráficos vetoriais minimalistas e infográficos animados",
      "Artigos de jornal e manchetes históricas escaneadas",
      "Foley tátil de papel, cliques mecânicos e wooshes suaves",
    ],
    colors: [
      { name: "Off-White Newsprint", hex: "#F3F0E6" },
      { name: "Charcoal Black", hex: "#1A1A1A" },
      { name: "Vox Yellow", hex: "#FFDC00" },
      { name: "Cartography Blue", hex: "#2E5B88" },
      { name: "Accent Crimson", hex: "#E63946" },
    ],
    audioStyle:
      "Batidas lo-fi elegantes, percussão minimalista, sintetizadores sutis e foley rico de jornal, teclado e fitas adesivas.",
    youtube: {
      primaryNiche: "Educação, Geopolítica & Videoensaios",
      subNiches: [
        "Geopolítica e Conflitos Internacionais",
        "História Econômica e Grandes Corporações",
        "Jornalismo Investigativo Digital",
        "Ciência de Dados e Sociedade",
      ],
      videoThemes: [
        "Por que as ferrovias dos EUA foram destruídas em 1950?",
        "A física invisível por trás dos navios cargueiros gigantes",
        "Como a Disney monopolizou o conceito de nostalgia",
        "A rota marítima secreta que controla 40% da economia mundial",
      ],
      referenceChannels: [
        "Vox",
        "Johnny Harris",
        "PolyMatter",
        "Wendover Productions",
        "Nerdwriter1",
        "Elementar",
      ],
    },
    aiPrompt:
      "A high-end dynamic documentary visual in Vox style, featuring a detailed 3D topographic relief map with illuminated trade routes, minimalist infographic data callouts, historical archival newspaper clippings with tactile paper grain, modern graphic design, sharp cinematography, 8k resolution",
  },
  {
    id: "mixed-media-collage",
    name: "Mixed Media & Scrapbook Collage",
    category: "creator",
    categoryLabel: "Creator Economy & Digital",
    image: "images/mixed_media_collage.jpg",
    badge: "Artesanal & Pop Art",
    vibe: "Criativo, irreverente, jovem, experimental e autoral",
    keyElements: [
      "Papel kraft rasgado, texturas de fita adesiva e carimbos",
      "Recortes de revistas de moda e jornais antigos",
      "Doodles desenhados à mão (linhas que contornam o assunto)",
      "Stop-motion digital a 12 ou 15 fps para os elementos gráficos",
      "Sobreposição de vídeo live-action com ilustrações animadas",
    ],
    colors: [
      { name: "Kraft Brown", hex: "#C8A97E" },
      { name: "Electric Pink", hex: "#FF007F" },
      { name: "Matte Black", hex: "#111111" },
      { name: "Acid Yellow", hex: "#D4FF00" },
      { name: "Cyan Pop", hex: "#00F0FF" },
    ],
    audioStyle:
      "Indie rock com bateria viva, hip-hop lo-fi com arranhões de vinil, efeitos sonoros de tesoura, lápis riscando papel e cliques rápidos.",
    youtube: {
      primaryNiche: "Cultura Pop, Moda & Storytelling Criativo",
      subNiches: [
        "Crítica Cultural & Retrospectivas de Celebridades",
        "História da Moda e Streetwear",
        "Ensaios sobre Música & Álbuns Icônicos",
        "Vlogs Criativos de Design & Portfólio",
      ],
      videoThemes: [
        "A evolução estética secreta de Billie Eilish explicada",
        "Por que os tênis dos anos 90 nunca saem de moda?",
        "Como Quentin Tarantino rouba (e transforma) a história do cinema",
        "O colapso da MTV e o nascimento da cultura de videoclipes",
      ],
      referenceChannels: [
        "Trash Dog",
        "Cole Caccamise",
        "Ali Abdaal (edições recentes)",
        "ModernGurlz",
        "Daniel Schiffer",
      ],
    },
    aiPrompt:
      "A vibrant mixed media collage artwork, combining torn magazine cutouts, kraft paper textures, hand-drawn vibrant ink doodles, stop-motion scrapbook aesthetic, pop art graphic overlays, tactile texture, editorial layout, 8k",
  },
  {
    id: "ugc-lofi-realism",
    name: "UGC / Raw / Lo-Fi Realism (Anti-Produção)",
    category: "creator",
    categoryLabel: "Creator Economy & Digital",
    image: "images/ugc_lofi_realism.jpg",
    badge: "Máxima Conexão & Confiança",
    vibe: "Íntimo, transparente, sem filtro, conversacional e espontâneo",
    keyElements: [
      "Câmera frontal de smartphone na mão ou apoiada numa xícara",
      "Iluminação natural de janela sem refletores artificiais",
      "Cortes secos naturais com pequenas respirações e hesitações reais",
      "Ausência de color grading estilizado (cores fiéis ao sensor)",
      "Áudio de microfone de lapela sem pós-processamento excessivo",
    ],
    colors: [
      { name: "Natural Skin", hex: "#E8BA9B" },
      { name: "Daylight Soft", hex: "#FAF8F5" },
      { name: "Room Ambience", hex: "#8E887E" },
      { name: "Casual Denim", hex: "#4A6B82" },
      { name: "Warm Wood", hex: "#8A5A36" },
    ],
    audioStyle:
      "Áudio limpo e íntimo, sem trilha sonora de fundo ou com música acústica instrumental em volume quase imperceptível (-24dB).",
    youtube: {
      primaryNiche: "Empreendedorismo, Reviews & Desenvolvimento Pessoal",
      subNiches: [
        "Depoimentos e Estudos de Caso Reais",
        "Análise Honesta de Produtos e Gadgets",
        "Finanças Pessoais 'Sem Filtro'",
        "Transição de Carreira & Bastidores de Negócios",
      ],
      videoThemes: [
        "A verdade sobre largar o CLT aos 26 anos (sem romantização)",
        "Usei o iPhone 16 por 30 dias: o que a Apple não te contou",
        "Minha rotina real morando sozinho em São Paulo com R$ 3.500",
        "Por que fechei minha agência que faturava 50k por mês",
      ],
      referenceChannels: [
        "Matt D'Avella (formato vlog)",
        "Ali Abdaal (vídeos descontraídos)",
        "Canais D2C de Review",
        "Nath Finanças",
        "Vloggers de Carreira",
      ],
    },
    aiPrompt:
      "First-person authentic POV UGC vlog scene, a young creator speaking directly to camera while holding a smartphone, natural morning window illumination, casual room interior background with soft depth of field, realistic skin texture, unedited raw aesthetic, 35mm lens effect",
  },
  {
    id: "retention-hyper-stim",
    name: "Hiper-Estimulante / Retention Editing (Estilo MrBeast)",
    category: "creator",
    categoryLabel: "Creator Economy & Digital",
    image: "images/retention_hyper_stim.jpg",
    badge: "Engajamento Viral & Ritmo Acelerado",
    vibe: "Eletrizante, hipnótico, maximalista, urgente e empolgante",
    keyElements: [
      "Cortes vertiginosos a cada 1.2 a 2.5 segundos",
      "Lente ultra-wide com distorção de perspectiva e dinamismo",
      "Expressões faciais de alto impacto e close-ups súbitos",
      "Textos cinéticos flutuantes coloridos que reagem à voz",
      "Efeitos visuais constantes: zoom ins, zooms outs, explosões 3D e contadores",
    ],
    colors: [
      { name: "Electric Cyan", hex: "#00E5FF" },
      { name: "Hyper Red", hex: "#FF003C" },
      { name: "Viral Neon Yellow", hex: "#FAFF00" },
      { name: "Deep Charcoal", hex: "#121214" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
    audioStyle:
      "Risers constantes, bass drops estrondosos, ticks de relógio rápidos, sonoplastia de videogame retrô e trilhas orquestrais épicas aceleradas.",
    youtube: {
      primaryNiche: "Entretenimento, Desafios & Gamificação",
      subNiches: [
        "Grandes Experimentos Sociais e Desafios de 24 Horas",
        "Competições com Prêmios e Gamificação",
        "Curiosidades Extremas e Comparações de Escala",
        "Reacts Dinâmicos e Conteúdos Virais Curtos",
      ],
      videoThemes: [
        "Passei 100 horas dentro de um bunker subterrâneo de luxo",
        "Último a tirar a mão do carro elétrico ganha R$ 50.000",
        "Construí a maior montanha-russa de papelão do mundo",
        "Comprei o objeto mais caro e o mais barato da Amazon",
      ],
      referenceChannels: [
        "MrBeast",
        "Enaldinho",
        "Ryan Trahan",
        "Airrack",
        "Mark Rober",
        "Unspeakable",
      ],
    },
    aiPrompt:
      "Ultra-wide dynamic fisheye angle, young charismatic creator with shocked excited expression, surrounded by explosive colorful 3D neon graphics, money confetti, bright saturated cinematic stage lighting, fast-paced YouTube thumbnail style, hyper-detailed, 8k",
  },

  // ---------------- NOVO: STICKMAN ANIMATION ----------------
  {
    id: "stickman-animation",
    name: "Stickman Animation (Boneco Palito Dinâmico & Épico)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/stickman_animation.jpg",
    badge: "Fórmula Viral & Criatividade Pura",
    vibe: "Divertido, surpreendente, veloz, hilário e incrivelmente fluido",
    keyElements: [
      "Bonecos palito com física de movimento hiper-fluida e expressiva",
      "Cenários de bloco de notas, folhas pautadas ou desktop digital interativo",
      "Transições onde o boneco interage com o mouse, caneta ou ferramentas digitais",
      "Cenas de ação acrobáticas coreografadas com timing de filmes de kung-fu",
      "Expressões visuais exageradas feitas apenas com círculos e linhas angulares",
    ],
    colors: [
      { name: "Hero Orange", hex: "#FF8C00" },
      { name: "Energy Cyan", hex: "#00F5D4" },
      { name: "Enemy Crimson", hex: "#FF3355" },
      { name: "Graph Paper Blue", hex: "#1A2234" },
      { name: "Ink White", hex: "#FFFFFF" },
    ],
    audioStyle:
      "Sonoplastia de chutes e socos dos anos 80, cliques de teclado e mouse, zumbidos elétricos de sabre de luz e trilhas eletro-orquestrais épicas.",
    youtube: {
      primaryNiche: "Ciência Rápida, Animação Viral & Comédia",
      subNiches: [
        "Batalhas Épicas de Animação (Stick Figure Warfare)",
        "Física, Matemática & Astronomia Explicadas em Minutos",
        "Monólogos de Comédia & Crítica Social Sarcástica",
        "Teorias e Aventuras em Universos de Games (Minecraft, Smash)",
      ],
      videoThemes: [
        "Física Quântica explicada por um Boneco Palito em 5 minutos",
        "Animation vs. Inteligência Artificial (Batalha Épica)",
        "Por que paquerar é matematicamente impossível (Análise Stickman)",
        "A história do Universo se a Terra tivesse 24 horas de existência",
      ],
      referenceChannels: [
        "Alan Becker (Animation vs)",
        "MinutePhysics",
        "Casually Explained",
        "CGP Grey",
        "GradeAUnderA",
        "Hyun's Dojo",
      ],
    },
    aiPrompt:
      "Dynamic stickman action animation, glowing orange stick figure wielding glowing cyan energy sword in combat pose, dark graph paper background, minimalist speed lines, fluid motion physics, epic martial arts choreography, 8k resolution",
  },

  // ---------------- NOVO: WHITEBOARD ANIMATION ----------------
  {
    id: "whiteboard-animation",
    name: "Whiteboard Animation / Scribe (Mão Desenhando)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/whiteboard_animation.jpg",
    badge: "Didatismo & Retenção de Aprendizado",
    vibe: "Didático, revelador, envolvente, confiável e estimulante",
    keyElements: [
      "Mão humana desenhando em tempo acelerado com marcador de quadro branco",
      "Diagramas conceituais que se conectam organicamente através de setas e engrenagens",
      "Metáforas visuais simples para explicar conceitos abstratos complexos",
      "Texto manuscrito que surge ao mesmo tempo em que a narração pronuncia a palavra",
      "Paleta contida: fundo branco puro com preto e 1 ou 2 cores marcadoras de destaque",
    ],
    colors: [
      { name: "Whiteboard Clean", hex: "#F8F9FA" },
      { name: "Marker Black", hex: "#1E1E24" },
      { name: "Highlight Red", hex: "#DC2626" },
      { name: "Marker Royal Blue", hex: "#2563EB" },
      { name: "Idea Amber", hex: "#F59E0B" },
    ],
    audioStyle:
      "Chiado característico da ponta de feltro do marcador no quadro branco, cliques de tampa de caneta, som de apagador e narração clara de podcast educativo.",
    youtube: {
      primaryNiche: "Resumo de Livros, Psicologia & Produtividade",
      subNiches: [
        "Resumos Visuais dos Mais Vendidos de Negócios e Finanças",
        "Psicologia Cognitiva & Quebra de Hábitos Nocivos",
        "Biologia & Neurociência Didática (Estilo AsapSCIENCE)",
        "Treinamentos Corporativos & História das Ideias",
      ],
      videoThemes: [
        "Resumo do livro 'Hábitos Atômicos' em 12 minutos ilustrados",
        "O que acontece com o seu cérebro quando você para de dormir?",
        "A psicologia da procrastinação: por que seu cérebro te sabota",
        "Como a moeda fiduciária e os bancos foram inventados (em desenhos)",
      ],
      referenceChannels: [
        "RSA Animate",
        "AsapSCIENCE",
        "Practical Psychology",
        "Illustrate to Educate",
        "FightMediocrity",
        "Casa do Saber",
      ],
    },
    aiPrompt:
      "Clean whiteboard animation scene, human hand holding a black dry erase marker drawing a detailed glowing lightbulb diagram and cognitive psychology gears, crisp white surface, colorful markers accents, educational scribe style, 8k",
  },

  // ---------------- NOVO: FLAT VECTOR KURZGESAGT ----------------
  {
    id: "vector-kurzgesagt",
    name: "Flat Vector & Isometric Explainer (Estilo Kurzgesagt)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/vector_kurzgesagt.jpg",
    badge: "Ciência de Alto Nível & Beleza Visual",
    vibe: "Fascinante, cósmico, otimista, existencial e graficamente deslumbrante",
    keyElements: [
      "Ilustrações vetoriais 2D com gradientes ricos e cores saturadas exuberantes",
      "Personagens icônicos estilizados (pássaros, cientistas, micróbios com olhos fofos)",
      "Transições de escala cósmica: do átomo ao universo em um único zoom contínuo",
      "Simetria e geometria sagrada com texturas limpas e sem contornos pesados",
      "Uso de luz e sombras em curvas vetoriais polidas de alta precisão",
    ],
    colors: [
      { name: "Cosmic Indigo", hex: "#131738" },
      { name: "Nebula Coral", hex: "#FF6B6B" },
      { name: "Duck Gold", hex: "#FECA57" },
      { name: "Atmosphere Teal", hex: "#10AC84" },
      { name: "Quantum Violet", hex: "#5F27CD" },
    ],
    audioStyle:
      "Trilhas sonoras eletrônicas orquestrais épicas e reflexivas (estilo Epic Mountain Music), narração solene de documentário e sons sci-fi limpos.",
    youtube: {
      primaryNiche: "Astrofísica, Filosofia Existencial & Biologia",
      subNiches: [
        "Paradoxo de Fermi e Busca por Vida Extraterrestre",
        "O Sistema Imunológico Humano em Guerra Biológica",
        "Megaprojetos de Engenharia Cósmica (Esferas de Dyson)",
        "Otimismo Existencial & Niilismo Construtivo",
      ],
      videoThemes: [
        "O que acontece se uma estrela de nêutrons atingir a Terra?",
        "O Sistema Imunológico: a guerra invisível dentro do seu corpo",
        "O Paradoxo de Fermi: por que ainda não encontramos alienígenas?",
        "A última coisa que vai acontecer no Universo conhecido",
      ],
      referenceChannels: [
        "Kurzgesagt – In a Nutshell",
        "RealLifeLore",
        "The Infographics Show",
        "Aperture",
        "Epic Mountain Music",
      ],
    },
    aiPrompt:
      "Kurzgesagt style flat vector illustration, a cute yellow scientist bird in lab coat gazing at a massive colorful cosmic planet with golden rings, deep starry nebula background, clean vector shapes, vibrant saturated gradients, modern motion design, 8k",
  },

  // ---------------- NOVO: PIXEL ART RETRO ----------------
  {
    id: "pixel-art-retro",
    name: "Pixel Art & 16-Bit Nostalgia",
    category: "retro",
    categoryLabel: "Retrô & Nostalgia",
    image: "images/pixel_art_retro.jpg",
    badge: "Retro Gaming & Arte Minuciosa",
    vibe: "Nostálgico, artesanal, vibrante, aconchegante e gamer",
    keyElements: [
      "Resolução de grade de pixels bem delimitada com clusters calculados",
      "Técnica de pontilhismo de cores (dithering) para simular degradês de luz",
      "Paleta de cores restrita inspirada nos chips de vídeo de SNES, Mega Drive ou Neo Geo",
      "Animação frame a frame de sprites em ciclo de caminhada ou combate",
      "Texturas e fontes pixeladas clássicas com estética arcade",
    ],
    colors: [
      { name: "Arcade Magenta", hex: "#FF0080" },
      { name: "Cyberpunk Amber", hex: "#FFE65A" },
      { name: "SNES Twilight", hex: "#120C22" },
      { name: "Grid Cyan", hex: "#00F5D4" },
      { name: "Retro Purple", hex: "#7800B4" },
    ],
    audioStyle:
      "Chiptune composto com ondas quadradas e triangulares em chips de 8-bit e 16-bit, sintetizadores FM e ruídos brancos estalados.",
    youtube: {
      primaryNiche: "Game Design Indie, Nostalgia 90s & Chiptune",
      subNiches: [
        "Análise de Level Design & História do Desenvolvimento de Jogos Clássicos",
        "Documentários sobre a Era de Ouro dos Flumperamas e Consoles 16-bit",
        "Tutoriais e Timelapses de Pixel Art no Aseprite",
        "Playlists de Estudo Chiptune / Lofi 16-Bit",
      ],
      videoThemes: [
        "Por que os gráficos 16-bit do SNES envelheceram melhor que o 3D dos anos 90?",
        "Como 'Chrono Trigger' revolucionou a narrativa nos videogames",
        "A engenharia secreta por trás da música em chips de som do Mega Drive",
        "Criei um jogo completo em Pixel Art em apenas 48 horas",
      ],
      referenceChannels: [
        "Brandon James Greer",
        "Paul Robertson",
        "Ahoy",
        "Game Maker's Toolkit",
        "Retro Game Corps",
        "Pedro Medeiros",
      ],
    },
    aiPrompt:
      "Detailed 16-bit pixel art cyberpunk city sunset, glowing pixel windows, neon synthwave grid, retro arcade color palette, isometric perspective, crisp pixel clusters, dithering textures, authentic SNES graphics, 8k",
  },

  // ---------------- NOVO: KINETIC TYPOGRAPHY ----------------
  {
    id: "kinetic-typography",
    name: "Kinetic Typography (Motion Tipográfico Puro)",
    category: "conceptual",
    categoryLabel: "Conceitual & IA Generativa",
    image: "images/kinetic_typography.jpg",
    badge: "Impacto Verbal & Design Editorial",
    vibe: "Urgente, rítmico, provocador, moderno e magnético",
    keyElements: [
      "Letras em caixas gigantes com fontes sem serifa pesadas (Helvetica, Grotesk)",
      "Animação sincronizada milissegundo a milissegundo com a cadência da voz falada",
      "Paleta de contraste altíssimo: preto, branco, amarelo sinalizador ou magenta",
      "Distorções de perspectiva 3D, estiramentos elásticos e rotações dinâmicas",
      "Diagramação tipográfica arrojada inspirada na escola de design suíço",
    ],
    colors: [
      { name: "Warning Yellow", hex: "#FFDC00" },
      { name: "Pitch Black", hex: "#0A0A0C" },
      { name: "Pure Signal White", hex: "#FFFFFF" },
      { name: "Neon Punch Pink", hex: "#FF006E" },
      { name: "Accent Cyan", hex: "#00F5D4" },
    ],
    audioStyle:
      "Gravações de discursos históricos com equalização de rádio, batidas de metrônomo, baixos distorcidos de hip-hop e cliques de máquina de escrever moderna.",
    youtube: {
      primaryNiche: "Manifestos de Marca, Teasers de Podcasts & Poesia",
      subNiches: [
        "Manifestos Comerciais de Empresas de Tecnologia e Inovação",
        "Cortes Curtos (Shorts/Reels) de Áudios Filosóficos de Podcasts",
        "Slam Poetry e Declamation de Monólogos Poéticos",
        "Anúncios Teaser de Lançamentos de Livros e Álbuns Musicais",
      ],
      videoThemes: [
        "O Manifesto dos Loucos: 'Think Different' de Steve Jobs em tipografia cinética",
        "Por que o tempo não existe: um poema em texto animado",
        "A declaração de independência da inteligência artificial",
        "O monólogo que salvou a carreira de Winston Churchill",
      ],
      referenceChannels: [
        "Apple (vídeos de produto e manifestos)",
        "Motion Design School",
        "Slam Poetry Brasil",
        "Vox (aberturas tipográficas)",
        "HubSpot Academy",
      ],
    },
    aiPrompt:
      "Bold kinetic typography poster art, overlapping giant black and white sans-serif letters, bright warning yellow and neon pink diagonal accents, dynamic perspective angles, high-fashion Swiss graphic design style, 8k",
  },

  // ---------------- ESTILOS CINEMATOGRÁFICOS ----------------
  {
    id: "indie-cinema-naturalist",
    name: "Cinema Indie / Naturalista (Mumblecore)",
    category: "cinema",
    categoryLabel: "Cinema & Live-Action",
    image: "images/indie_cinema_naturalist.jpg",
    badge: "Sensibilidade & Narrativa Profunda",
    vibe: "Contemplativo, intimista, melancólico, poético e orgânico",
    keyElements: [
      "Luz dourada mágica (Golden Hour) ou iluminação de dias nublados",
      "Câmera na mão orgânica com micro-balanços que respiram com a cena",
      "Paleta de tons terrosos, linho, verde-oliva e âmbar",
      "Planos longos que dão espaço para o silêncio e reflexão",
      "Textura analógica suave com grão fino e sombras amenas",
    ],
    colors: [
      { name: "Golden Hour Amber", hex: "#DDA15E" },
      { name: "Olive Earth", hex: "#606C38" },
      { name: "Linen Cream", hex: "#FEFAE0" },
      { name: "Muted Terracotta", hex: "#BC6C25" },
      { name: "Slate Mist", hex: "#7E8D85" },
    ],
    audioStyle:
      "Piano acústico suave (estilo Olafur Arnalds ou Nils Frahm), violão dedilhado, som ambiente rico (vento, ondas, estalos de madeira).",
    youtube: {
      primaryNiche: "Slow Living, Fotografia & Filosofia Prática",
      subNiches: [
        "Vlogs Cinematográficos de Viagem e Desconexão",
        "Ensaios Visuais sobre Solidão, Arte e Literatura",
        "Rotinas Criativas de Pintores, Arquitetos e Escritores",
        "Tutoriais e Reflexões sobre Fotografia de Rua",
      ],
      videoThemes: [
        "A arte de desacelerar: 7 dias em uma cabana sem internet",
        "Por que as cidades modernas estão deixando as pessoas sozinhas?",
        "Uma manhã silenciosa fotografando a névoa de outono em Tóquio",
        "O que aprendi lendo Marco Aurélio durante meu pior ano",
      ],
      referenceChannels: [
        "Kold",
        "Sam Kolder",
        "Manga Street Photography",
        "Robin Seplut",
        "Nathaniel Drew",
        "Alen Palander",
      ],
    },
    aiPrompt:
      "Cinematic indie film still, poetic golden hour light filtering through windblown linen curtains, thoughtful subject gazing towards the sea, muted earthy color grade, Kodak Vision3 250D look, gentle organic film grain, shallow depth of field, 35mm anamorphic lens, 8k",
  },
  {
    id: "commercial-glossy",
    name: "Commercial Glossy Hi-End (Estúdio & Luxo)",
    category: "cinema",
    categoryLabel: "Cinema & Live-Action",
    image: "images/commercial_glossy.jpg",
    badge: "Aspiracional & Perfeição Técnica",
    vibe: "Impecável, luxuoso, futurista, confiável e hipnótico",
    keyElements: [
      "Iluminação de estúdio multi-ponto com luzes de contorno (rim lights)",
      "Movimentos de câmera perfeitamente fluidos com braços robóticos / sliders",
      "Reflexos especulares límpidos sobre vidro, água e metais polidos",
      "Color grading cirúrgico, pele de vidro e detalhes macro em 4K/8K",
      "Super slow-motion (120fps a 1000fps) em gotas, partículas e tecidos",
    ],
    colors: [
      { name: "Crystal Aqua", hex: "#70D6FF" },
      { name: "Platinum White", hex: "#F8F9FA" },
      { name: "Obsidian Black", hex: "#0B090A" },
      { name: "Rose Champagne", hex: "#E0B1CB" },
      { name: "Studio Gold", hex: "#D4AF37" },
    ],
    audioStyle:
      "Batidas eletrônicas sofisticadas de deep house/future bass, synths etéreos e foley macro ultra-nítido de líquidos, cliques magnéticos e vidros.",
    youtube: {
      primaryNiche: "Tecnologia, Beleza & Design de Produto",
      subNiches: [
        "Cinematografia de Produto & Bastidores Comerciais",
        "Tech Reviews de Alto Padrão (Smartphones, Monitores, Câmeras)",
        "Skincare & Cosméticos Científicos",
        "Unboxings Sensoriais e ASMR de Gadgets",
      ],
      videoThemes: [
        "Criando um comercial de perfume de R$ 50.000 no meu quarto",
        "A engenharia obsessiva por trás do novo relógio da Apple",
        "Como a iluminação de estúdio transforma qualquer produto barato",
        "O comercial mais difícil que já dirigi com braço robótico",
      ],
      referenceChannels: [
        "Daniel Schiffer",
        "Marques Brownlee (MKBHD)",
        "Gerald Undone",
        "Peter McKinnon",
        "Potato Jet",
      ],
    },
    aiPrompt:
      "High-end luxury commercial still, a minimalist frosted glass cosmetic bottle floating serenely above crystal-clear ripple water surface, flawless studio three-point lighting with soft rim glows, pristine liquid reflections, hyper-detailed product photography, 8k",
  },
  {
    id: "neo-noir",
    name: "Film Noir & Neo-Noir Contemporâneo",
    category: "cinema",
    categoryLabel: "Cinema & Live-Action",
    image: "images/neo_noir.jpg",
    badge: "Suspense, Mistério & Alto Contraste",
    vibe: "Sombrio, enigmático, tenso, sofisticado e instigante",
    keyElements: [
      "Iluminação chiaroscuro severa que corta o quadro em luz e trevas",
      "Sombras projetadas de venezianas, grades ou fumaça densa",
      "Cenas noturnas com chuva, asfalto molhado e lâmpadas de tungstênio",
      "Paleta quase monocromática pontuada por uma única cor de destaque",
      "Planos inclinados (Dutch angle) para transmitir instabilidade psicológica",
    ],
    colors: [
      { name: "Deep Shadow", hex: "#08080A" },
      { name: "Tungsten Amber", hex: "#FF9F1C" },
      { name: "Smoky Cyan", hex: "#1D3557" },
      { name: "Blood Ruby", hex: "#9B111E" },
      { name: "Silver Ash", hex: "#CED4DA" },
    ],
    audioStyle:
      "Saxofone melancólico com eco distante, contrabaixo acústico, passos lentos no asfalto molhado, trovões abafados e trilha orquestral sombria.",
    youtube: {
      primaryNiche: "True Crime, Mistérios & Psicologia Sombria",
      subNiches: [
        "Casos Criminais Não Resolvidos & Investigação Forense",
        "Filosofia Niilista & Análise de Anti-heróis",
        "Histórias do Submundo da Internet & Dark Web",
        "Crítica de Cinema de Suspense e Espionagem",
      ],
      videoThemes: [
        "O mistério do homem de Somerton que a polícia nunca decifrou",
        "Como os maiores hackers do mundo operavam nas sombras nos anos 90",
        "A anatomia psicológica de 'Blade Runner': por que é atemporal?",
        "O assassinato que mudou a história do jornalismo investigativo",
      ],
      referenceChannels: [
        "LEMMINO",
        "Coffeehouse Crime",
        "Fern",
        "That Chapter",
        "Nexpo",
        "JCS - Criminal Psychology",
      ],
    },
    aiPrompt:
      "Cinematic Neo-Noir scene, dramatic high-contrast chiaroscuro shadows cutting across detective's face through wooden Venetian window blinds, cigarette smoke curling in cold light beam, wet rainy city night visible through glass, moody 35mm film, atmospheric tension, 8k",
  },
  {
    id: "wes-anderson-symmetry",
    name: "Simetria Wes Anderson (Pastel & Tableau)",
    category: "cinema",
    categoryLabel: "Cinema & Live-Action",
    image: "images/wes_anderson_symmetry.jpg",
    badge: "Geometria Teatral & Cores Pastéis",
    vibe: "Curioso, excêntrico, metódico, acolhedor e visualmente perfeito",
    keyElements: [
      "Composição perfeitamente centralizada no eixo cartesiano",
      "Movimentos de câmera secos em 90 graus (whip pans) ou travellings frontais",
      "Paleta de cores rigorosamente controlada com tons pastéis vintage",
      "Figurinos monocromáticos com caimento retrô e adereços meticulosos",
      "Tipografia Futura Bold ou Windsor amarela aplicada centralizada",
    ],
    colors: [
      { name: "Pastel Pink Hotel", hex: "#F7CAD0" },
      { name: "Mustard Courtesan", hex: "#F3C053" },
      { name: "Robin Egg Blue", hex: "#90E0EF" },
      { name: "Burgundy Velvet", hex: "#590D22" },
      { name: "Mint Macaron", hex: "#C7F9CC" },
    ],
    audioStyle:
      "Música de câmara francesa com cravo, xilofone, percussão leve de relógio, violinos em staccato e narração impassível (deadpan).",
    youtube: {
      primaryNiche: "Design, Arquitetura & Viagens Pitorescas",
      subNiches: [
        "Tours por Casas e Hotéis Históricos Excêntricos",
        "Culinária & Confeitaria Estética Francesa",
        "Crítica de Arquitetura & Urbanismo Europeu",
        "Ensaios Biográficos sobre Artistas e Personagens Curiosos",
      ],
      videoThemes: [
        "Visitei a cidade mais colorida e perfeitamente simétrica da Europa",
        "A receita original do bolo Courtesan au Chocolat do Grande Hotel Budapeste",
        "Por que as cores dos anos 60 nos deixam confortáveis?",
        "Organizei meu estúdio exatamente como um filme do Wes Anderson",
      ],
      referenceChannels: [
        "Accidentally Wes Anderson",
        "The French Dispatch Style Shorts",
        "Van Neistat",
        "Binging with Babish (episódios conceituais)",
        "Kirsten Dirksen",
      ],
    },
    aiPrompt:
      "Wes Anderson aesthetic, flawless perfectly centered bilateral symmetry, vintage grand hotel reception desk, warm pastel palette of pale pink and mustard yellow, eccentric uniformed concierge looking straight into lens, theatrical diorama framing, 35mm panavision, 8k",
  },

  // ---------------- ESTILOS RETRÔ ----------------
  {
    id: "vhs-y2k-retro",
    name: "VHS / Y2K (Anos 90 & Década de 2000)",
    category: "retro",
    categoryLabel: "Retrô & Nostalgia",
    image: "images/vhs_y2k_retro.jpg",
    badge: "Subcultura & Estética de Fita",
    vibe: "Nostálgico, rebelde, caótico, underground e autêntico",
    keyElements: [
      "Proporção de tela 4:3 com cantos arredondados de monitor CRT",
      "Linhas de rastreio de fita VHS (tracking error lines) e scanlines",
      "Aberração cromática forte (separação de canais RGB nas bordas)",
      "Carimbo de data em fonte OSD pixelada vermelha ou verde (ex: OCT 1999 PLAY)",
      "Cores levemente saturadas e contraste com pretos empastados",
    ],
    colors: [
      { name: "OSD Red", hex: "#FF0033" },
      { name: "CRT Green", hex: "#00FF66" },
      { name: "Tape Black", hex: "#0D0D11" },
      { name: "Acid Silver", hex: "#A8B2C1" },
      { name: "Arcade Purple", hex: "#6B2D82" },
    ],
    audioStyle:
      "Gravações lo-fi com chiado de fita cassete (tape hiss), guitarras grunge distorcidas, batidas de breakbeat anos 90 e voz abafada com efeito walkie-talkie.",
    youtube: {
      primaryNiche: "Gaming Retrô, Skate & Moda Streetwear",
      subNiches: [
        "Retrospectivas de Consoles Clássicos (PS1, N64, Game Boy)",
        "Cultura de Skate de Rua & Streetwear Y2K",
        "Música Underground & Lost Media da Internet",
        "Videoclipes e Gravações de Bastidores em Camcorder",
      ],
      videoThemes: [
        "A ascensão e queda do PS1: como a Sony mudou os games para sempre",
        "Filmamos um dia inteiro de skate com uma Sony VX1000 original",
        "As músicas perdidas da internet do início dos anos 2000",
        "Comprei todas as roupas da moda Y2K em brechós de rua",
      ],
      referenceChannels: [
        "Noclip (história de games)",
        "Berrics (vídeos estilo VX)",
        "Canais de skate underground",
        "Thrasher Magazine",
        "Wavywebsurf",
      ],
    },
    aiPrompt:
      "Authentic 1999 VHS tape screengrab in 4:3 aspect ratio, vintage arcade hall with glowing neon game cabinets, visible CRT scanlines, analog tracking distortion, tape noise, red digital timestamp 'OCT 14 1999 PLAY' in lower corner, glitch aesthetic, nostalgic retro vibe",
  },
  {
    id: "vintage-16mm-super8",
    name: "Película Vintage (16mm & Super 8)",
    category: "retro",
    categoryLabel: "Retrô & Nostalgia",
    image: "images/vintage_16mm_super8.jpg",
    badge: "Memória Afetiva & Textura Analógica",
    vibe: "Sensível, saudosista, ensolarado, poético e acolhedor",
    keyElements: [
      "Grão analógico espesso e pulsante que dá vida à imagem",
      "Vazamentos de luz dourados e alaranjados (light leaks)",
      "Bordas de filme aparentes com perfurações laterais",
      "Cores quentes com tons de pele âmbar e verdes saturados",
      "Frequência de 18 ou 24 quadros por segundo com leve instabilidade de obturador",
    ],
    colors: [
      { name: "Kodachrome Yellow", hex: "#FFB703" },
      { name: "Warm Amber", hex: "#FB8500" },
      { name: "Coastal Teal", hex: "#219EBC" },
      { name: "Sun Bleached White", hex: "#FFF3E0" },
      { name: "Earth Umber", hex: "#3D2B1F" },
    ],
    audioStyle:
      "Som mecânico do motor do projetor de cinema girando, trilha de folk acústico, guitarras surf rock quentes e sons da natureza com reverberação suave.",
    youtube: {
      primaryNiche: "Viagens, Estilo de Vida & Ensaios Pessoais",
      subNiches: [
        "Diários de Viagem de Verão & Road Trips",
        "Casamentos & Histórias de Amor Reais",
        "Cultura Surf & Vida Litorânea",
        "Ensaios sobre Memória, Família e Envelhecimento",
      ],
      videoThemes: [
        "Cruzei a costa da Itália filmando apenas com uma câmera Super 8",
        "O que encontrei nas fitas 16mm da minha família de 1974",
        "Por que a fotografia analógica nunca vai morrer na era digital",
        "Um verão inesquecível na Califórnia: nosso diário de bordo",
      ],
      referenceChannels: [
        "Christian Schaffer",
        "Jack Conte (ensaios antigos)",
        "Sam Kolder (versões film look)",
        "Mark Bone",
        "Wong Fu Productions",
      ],
    },
    aiPrompt:
      "Nostalgic vintage Super 8mm film still, friends driving in an open vintage convertible along a sun-drenched coastal highway, heavy warm Kodak film grain, golden lens flares and light leaks, faded retro summer colors, genuine analogue film texture, 8k",
  },
  {
    id: "cyberpunk-synthwave",
    name: "Cyberpunk & Synthwave (Retro-Futurismo 80s)",
    category: "retro",
    categoryLabel: "Retrô & Nostalgia",
    image: "images/cyberpunk_synthwave.jpg",
    badge: "Energia Noturna & Futurismo Tecnológico",
    vibe: "Distópico, elétrico, veloz, misterioso e tecnicamente imersivo",
    keyElements: [
      "Contrastes de neon vibrante: magenta quente versus ciano elétrico",
      "Asfalto molhado com reflexos especulares das luzes da cidade",
      "Neblina densa, chuva noturna e vapor saindo de bueiros",
      "Carros com linhas angulares aerodinâmicas dos anos 80 reinventados",
      "Elementos de interface holográfica com tipografia japonesa futurista",
    ],
    colors: [
      { name: "Synth Magenta", hex: "#FF007F" },
      { name: "Cyber Cyan", hex: "#00F5D4" },
      { name: "Neon Violet", hex: "#7B2CBF" },
      { name: "Rain Asphalt", hex: "#0F111A" },
      { name: "Laser Orange", hex: "#FF5400" },
    ],
    audioStyle:
      "Sintetizadores analógicos gordos (Moog, Juno-60), batidas de drum machine 808/Linndrum, solos de guitarra sintetizada e arpeggios hipnóticos.",
    youtube: {
      primaryNiche: "Hardware Tech, Games & Música Eletrônica",
      subNiches: [
        "Análise de Placas de Vídeo & Setups Gamer Noturnos",
        "Lofi & Retrowave Livestreams / Playlists de Estudo",
        "Crítica e Teoria sobre Ficção Científica e Cyberpunk",
        "Carros Modificados & Drift Noturno",
      ],
      videoThemes: [
        "Montei o setup gamer cyberpunk definitivo de R$ 30.000",
        "Por que 2026 está se tornando exatamente o que 'Akira' previu?",
        "A evolução do design dos carros dos anos 80 até o futuro",
        "Como produzir uma faixa Synthwave completa do zero em 1 hora",
      ],
      referenceChannels: [
        "The Midnight (música)",
        "NewRetroWave",
        "Hardware Canucks",
        "Dave2D",
        "Corridor Crew",
      ],
    },
    aiPrompt:
      "Cinematic Cyberpunk synthwave street at night, wet rain-slicked asphalt reflecting vivid neon signs in magenta and glowing cyan, futuristic angular sports car, misty atmospheric haze, towering holographic skyscrapers, 8k resolution",
  },

  // ---------------- ESTILOS ANIMAÇÃO TRADICIONAL ----------------
  {
    id: "anime-cel-shading",
    name: "Anime Tradicional & Cel-Shading (Ghibli & Shōnen)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/anime_cel_shading.jpg",
    badge: "Poesia Visual & Narrativa Épica",
    vibe: "Emocionante, expansivo, detalhista, épico e sonhador",
    keyElements: [
      "Traços manuais de contorno limpos com sombreamento em 2 tons (two-tone shading)",
      "Pintura de cenários detalhados em aquarela/matte painting",
      "Céus azuis imensos com nuvens volumosas e translúcidas",
      "Foco em pequenos detalhes da vida cotidiana (culinária, vento na grama)",
      "Linhas de velocidade (speed lines) dinâmicas em cenas de ação",
    ],
    colors: [
      { name: "Ghibli Sky Blue", hex: "#48CAE4" },
      { name: "Meadow Green", hex: "#52B788" },
      { name: "Sunlit Cloud", hex: "#FFFDF0" },
      { name: "Warm Terracotta", hex: "#E07A5F" },
      { name: "Shonen Navy", hex: "#1D3557" },
    ],
    audioStyle:
      "Trilhas orquestrais com piano lírico (estilo Joe Hisaishi), flautas japonesas tradicionais, sons crocantes de comida e silêncios contemplativos.",
    youtube: {
      primaryNiche: "Anime, Análise Narrativa & Culinária Estética",
      subNiches: [
        "Ensaios Profundos sobre Roteiro de Animes e Mangás",
        "Recriação de Comidas de Filmes de Animação",
        "Tutoriais de Ilustração e Pintura Digital",
        "Comparações de Animação Sakuga e Filosofia Oriental",
      ],
      videoThemes: [
        "A filosofia de Hayao Miyazaki que falta no cinema ocidental",
        "Recriei o banquete completo de 'A Viagem de Chihiro' na vida real",
        "Por que a cena de luta de Jujutsu Kaisen demorou 6 meses para ser animada",
        "Como desenhar nuvens de anime que parecem vivas (passo a passo)",
      ],
      referenceChannels: [
        "Beyond the Bot",
        "The Anime Man",
        "Trash Taste",
        "Gigguk",
        "Drawfee",
        "Kuma Films",
      ],
    },
    aiPrompt:
      "Studio Ghibli inspired anime illustration still, breathtaking coastal Japanese village under massive painted cumulus clouds in a bright blue sky, detailed watercolor background scenery, vibrant lush greenery, crisp cel-shaded 2D anime character looking toward the sea, masterpiece, 8k",
  },
  {
    id: "claymation-stop-motion",
    name: "Claymation & Stop-Motion Artesanal",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/claymation_stop_motion.jpg",
    badge: "Textura Humana & Charme Artesanal",
    vibe: "Acolhedor, lúdico, nostálgico, surreal e irresistivelmente tátil",
    keyElements: [
      "Texturas reais de massinha de modelar com marcas de dedos dos artistas",
      "Taxa de quadros reduzida para 12 fps (animação em dois quadros)",
      "Iluminação de estúdio física com sombras duras reais em miniaturas",
      "Materiais orgânicos misturados: tecido, arame, madeira e papelão",
      "Imperfeições propositais de movimento que conferem vida e calor",
    ],
    colors: [
      { name: "Clay Ochre", hex: "#D48B47" },
      { name: "Terracotta Red", hex: "#C0523C" },
      { name: "Studio Sage", hex: "#839788" },
      { name: "Warm Cream", hex: "#F3ECD7" },
      { name: "Miniature Slate", hex: "#4A525D" },
    ],
    audioStyle:
      "Foley amplificado ultra-tátil: amassados de massa, cliques de botões de plástico, passos de madeira e trilha com xilofone, percussão acústica e ukelele.",
    youtube: {
      primaryNiche: "Stop Motion Art, ASMR Culinário & Curtas Autorais",
      subNiches: [
        "Animações Culinárias em Massinha (Stop-Motion Cooking)",
        "Bastidores de Criação de Modelos e Bonecos",
        "Curtas Narrativos Independentes e Paródias",
        "Comerciais Conceituais e Vinhetas de Marca",
      ],
      videoThemes: [
        "Cozinhando um café da manhã completo feito 100% de massinha (ASMR)",
        "Demorei 800 horas para animar este vídeo de 3 minutos",
        "Como construir o esqueleto de arame de um personagem de stop-motion",
        "A física dos líquidos feita com massinha e gelatina",
      ],
      referenceChannels: [
        "Guldies",
        "PES (criador de Fresh Guacamole)",
        "Lee Hardcastle",
        "Tomostyle",
        "Eduard Puertas",
      ],
    },
    aiPrompt:
      "Charming claymation stop-motion still, handcrafted clay bakery kitchen in miniature scale, adorable clay baker character taking freshly baked bread from a brick oven, visible fingerprint textures on plasticine, authentic studio miniature soft lighting, Aardman and Laika style, 8k",
  },
  {
    id: "abstract-3d-cgi",
    name: "3D Abstrato & Motion Design Cromo (CGI)",
    category: "animation",
    categoryLabel: "Animação & Motion",
    image: "images/abstract_3d_cgi.jpg",
    badge: "Hipnótico, Moderno & Alta Tecnologia",
    vibe: "Futurista, elegante, zen, sensorial e de precisão matemática",
    keyElements: [
      "Esferas de cromo líquido e vidro canelado com refração iridescente",
      "Simulações físicas perfeitas de gravidade zero e colisões elásticas",
      "Iluminação cáustica detalhada (dispersão de luz através do vidro)",
      "Cenários de estúdio monocromáticos minimalistas com pedestais limpos",
      "Movimentos em loop infinito milimetricamente sincronizados",
    ],
    colors: [
      { name: "Iridescent Chrome", hex: "#D8E2DC" },
      { name: "Liquid Titanium", hex: "#9D8189" },
      { name: "Prism Violet", hex: "#B5838D" },
      { name: "Matte Void", hex: "#141419" },
      { name: "Caustic Cyan", hex: "#48CAE4" },
    ],
    audioStyle:
      "Trilhas de ambient techno espacial, sons de sintetizador granular, ressonâncias de taças de cristal e cliques metálicos de precisão suíça.",
    youtube: {
      primaryNiche: "Motion Design, Tech Branding & Música Eletrônica",
      subNiches: [
        "Tutoriais Avançados de Blender, Cinema 4D e Houdini",
        "Visualizers Oficiais para Gravadoras e DJs",
        "Vídeos de 'Oddly Satisfying' com Simulações de Física 3D",
        "Aberturas Conceituais de Festivais de Tecnologia e Conferências",
      ],
      videoThemes: [
        "Como criei uma animação 3D hipnótica no Blender que viralizou",
        "A matemática da simulação de fluidos explicada visualmente",
        "Redesenhando a identidade visual da Apple em 3D abstrato",
        "10 simulações de física 3D perfeitamente satisfatórias em loop",
      ],
      referenceChannels: [
        "Ducky 3D",
        "Greyscalegorilla",
        "Ian Hubert",
        "Blender Guru",
        "Beeple (conceito)",
        "Mattrunks",
      ],
    },
    aiPrompt:
      "Satisfying 3D abstract motion design render, floating iridescent liquid chrome spheres, refractive fluted glass prisms, soft pastel studio backdrop, ray-traced caustics, Octane render, Octane render 8k",
  },

  // ---------------- ESTILOS CONCEITUAIS & IA ----------------
  {
    id: "dreamcore-liminal",
    name: "Dreamcore & Espaços Liminares",
    category: "conceptual",
    categoryLabel: "Conceitual & IA Generativa",
    image: "images/dreamcore_liminal.jpg",
    badge: "Nostalgia Inquietante & Mistério Onírico",
    vibe: "Surreal, melancólico, estranhamente familiar e solitário",
    keyElements: [
      "Arquiteturas de transição desoladas: piscinas cobertas, corredores de hotel",
      "Ausência total de seres vivos ou qualquer presença humana evidente",
      "Iluminação difusa de lâmpadas fluorescentes sem sombras projetadas nítidas",
      "Cores levemente desbotadas que lembram fotos de câmeras digitais de 2004",
      "Sensação de estar preso dentro de uma memória de infância esquecida",
    ],
    colors: [
      { name: "Pool Tile Cyan", hex: "#0077B6" },
      { name: "Fluorescent Green", hex: "#90E0EF" },
      { name: "Faded Beige", hex: "#DDB892" },
      { name: "Subterranean Void", hex: "#03045E" },
      { name: "Echo White", hex: "#EDF2F4" },
    ],
    audioStyle:
      "Música de shopping desacelerada com eco infinito (Mallsoft / Vaporwave), zumbido elétrico de luz fluorescente (hum 60Hz) e gotejar de água distante.",
    youtube: {
      primaryNiche: "Histórias da Internet, Horror Psicológico & Filosofia",
      subNiches: [
        "Exploração da Teoria dos 'Backrooms' e Espaços Liminares",
        "Ensaios sobre 'Anemoia' (Nostalgia de um tempo nunca vivido)",
        "Músicas Ambientais Mallsoft / Liminal Playlists de Foco",
        "Documentários sobre Shoppings Fantasmas e Prédios Abandonados",
      ],
      videoThemes: [
        "Por que esta foto de uma piscina vazia te causa tanta angústia?",
        "A filosofia secreta por trás dos Backrooms explicada",
        "Visitei o shopping abandonado mais famoso dos Estados Unidos",
        "Como a internet inventou uma nova forma de nostalgia que nunca existiu",
      ],
      referenceChannels: [
        "Kane Pixels (The Backrooms)",
        "Solar Sands",
        "Broey Deschanel",
        "Wendigoon",
        "Vapor Memory",
      ],
    },
    aiPrompt:
      "Liminal space, dreamcore aesthetic, empty subterranean indoor tiled pool chamber, fluorescent diffused lighting, eerie nostalgic silence, vaporwave liminal photography, mysterious dreamlike atmosphere, 8k",
  },
  {
    id: "brutalism-digital",
    name: "Brutalismo Digital & Industrial",
    category: "conceptual",
    categoryLabel: "Conceitual & IA Generativa",
    image: "images/brutalism_digital.jpg",
    badge: "Vanguardismo, Força & Concreto Cru",
    vibe: "Monolítico, rebelde, direto, austero e sem compromissos estéticos fáceis",
    keyElements: [
      "Concreto armado aparente, aço corten e superfícies industriais cruas",
      "Tipografia em caixa alta monumental sem serifa ocupando até 60% da tela",
      "Grids geométricos rígidos e diagramações assimétricas arrojadas",
      "Alto contraste preto e cinza com pontos de impacto de uma cor primária dura",
      "Cortes de câmera secos e sem transições suaves",
    ],
    colors: [
      { name: "Raw Concrete", hex: "#495057" },
      { name: "Heavy Shadow", hex: "#121214" },
      { name: "Industrial Steel", hex: "#ADB5BD" },
      { name: "Hazard Yellow", hex: "#FFD000" },
      { name: "Paper White", hex: "#F8F9FA" },
    ],
    audioStyle:
      "Industrial techno pesado, sons de martelos hidráulicos, sintetizadores analógicos com distorção ríspida e ausência de melodias doces.",
    youtube: {
      primaryNiche: "Arquitetura, Design Gráfico & Filosofia Crítica",
      subNiches: [
        "História e Defesa da Arquitetura Brutalista",
        "Tendências de UI/UX Design Experimental e Web Brutalism",
        "Manifestos Artísticos e Crítica à Padronização Visual Corporativa",
        "Música Eletrônica Underground e Produção Industrial",
      ],
      videoThemes: [
        "Por que os prédios de concreto da Guerra Fria eram geniais?",
        "O fim do design minimalista limpinho: a revolução do Brutalismo",
        "Como diagramar layouts editoriais monumentais como cartazes soviéticos",
        "A história sombria dos complexos residenciais brutalistas de Londres",
      ],
      referenceChannels: [
        "The B1M",
        "Design Syndrome",
        "Will Paterson (críticas conceituais)",
        "Hate5six",
        "Boiler Room",
      ],
    },
    aiPrompt:
      "Monolithic digital brutalism architecture, raw unpolished exposed concrete, heavy geometric shadows, bold stark contrast, high fashion editorial lighting, massive minimalist structures, architectural photography, 8k",
  },
  {
    id: "dark-fantasy-gothic",
    name: "Dark Fantasy / Gótico Barroco",
    category: "conceptual",
    categoryLabel: "Conceitual & IA Generativa",
    image: "images/dark_fantasy_gothic.jpg",
    badge: "Mitologia Sombria & Grandiosidade Épica",
    vibe: "Solene, místico, monumental, dramático e arrebatador",
    keyElements: [
      "Feixes de luz volumétrica (god rays) atravessando vitrais quebrados e névoa",
      "Catedrais góticas, ruínas ancestrais e gárgulas em pedra desgastada",
      "Tons de ouro envelhecido, veludo carmesim escuro e ferro batido",
      "Câmera lenta épica revelando armaduras ornamentadas e criaturas colossais",
      "Sensação de um mundo imenso que sobreviveu a um cataclismo sagrado",
    ],
    colors: [
      { name: "Cathedral Stone", hex: "#1B171D" },
      { name: "Decayed Gold", hex: "#C5A059" },
      { name: "Velvet Crimson", hex: "#4A051C" },
      { name: "Volumetric Mist", hex: "#6C757D" },
      { name: "Cursed Amber", hex: "#D48B38" },
    ],
    audioStyle:
      "Coros gregorianos soturnos, violoncelos graves, órgãos de tubos ressonantes, címbalos escuros e trompas de guerra distantes.",
    youtube: {
      primaryNiche: "Lore de Games, Dark Fantasy & Mitologia",
      subNiches: [
        "Explicações Detalhadas de História de Games (Elden Ring, Dark Souls)",
        "Worldbuilding para Escritores de Fantasia Sombria e Mestres de RPG",
        "Vídeos de Inteligência Artificial Narrativa & Dark Cinematic AI",
        "Análise de Mitologias Arcaicas e Folclore Obscuro",
      ],
      videoThemes: [
        "A tragédia completa de Malenia explicada em detalhes (Elden Ring)",
        "Como construir um universo de fantasia sem cair nos clichês de Tolkien",
        "Gerei um filme inteiro de Dark Fantasy medieval usando Runway e Midjourney",
        "A verdadeira história dos cavaleiros da peste negra na Europa feudal",
      ],
      referenceChannels: [
        "VaatiVidya",
        "The Lore Network",
        "SmugMug Lore",
        "Tale Foundry",
        "Alt Shift X",
      ],
    },
    aiPrompt:
      "Cinematic dark fantasy, baroque cathedral interior in ruins, dramatic volumetric god rays through thick haze, gothic stone gargoyles, decayed gold leaf ornaments, Elden Ring mood, 35mm film, volumetric lighting, photorealistic 8k",
  },
];

export const visualStyleFamilies = [
  "Todos",
  "Animação & Motion",
  "Creator Economy & Digital",
  "Cinema & Live-Action",
  "Retrô & Nostalgia",
  "Conceitual & IA Generativa",
];
