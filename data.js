/*
  DADOS DO PORTFÓLIO — edite só este arquivo para atualizar o site.

  Status possíveis (projetos e módulos):
    "concluido"        -> 3 barras cheias
    "desenvolvimento"  -> 2 barras
    "prototipo"        -> 2 barras
    "planejado"        -> 0 barras

  Para adicionar um projeto novo: copie o bloco do NetConfig Pro dentro de
  "projetos", troque os textos e salve. O carrossel é criado sozinho.
  Campos vazios ("") ficam escondidos no site.
*/
window.PORTFOLIO = {
  atualizado: "nov/2026",

  perfil: {
    nome: "Arthur Saraiva",
    nomeCompleto: "Arthur Saraiva de Souza",
    headline: [
      "IT Support",
      "Infrastructure & Networking",
      "Information Security",
      "Network Technician",
      "Software Engineering Student"
    ],
    cidade: "Fortaleza, CE",
    sobre: [
      "Trabalho com infraestrutura e segurança no dia a dia: suporte N1/N2, Active Directory e Google Workspace, rede UniFi e monitoramento de firewall Sophos. Quando uma tarefa se repete, escrevo um script em PowerShell, Python ou Batch para ela.",
      "Sou técnico em Redes de Computadores pelo SESI SENAI (1.200 h) e curso Engenharia de Software na UniAteneu. Meu foco é segurança da informação, com base sólida em redes.",
      "Fora do trabalho, desenvolvo o NetConfig Pro, uma ferramenta que gera a configuração de equipamentos de rede já com validações de segurança."
    ]
  },

  contato: {
    email: "arthursaraiva.cybersec@gmail.com",
    linkedin: "https://www.linkedin.com/in/arthur-saraiva-de-souza-4b6a0b280",
    github: "https://github.com/ArthurCoding",
    curriculoPdf: ""   // ex.: "curriculo-arthur-saraiva.pdf" — vazio = botão escondido
  },

  experiencias: [
    {
      empresa: "Sistema Jangadeiro",
      cargo: "Estagiário de Infraestrutura e Segurança da Informação",
      inicio: "09/2026",
      fim: "atual",
      atividades: [
        "Suporte N1/N2 presencial e remoto (VNC, SSH) em Windows e Linux",
        "Gestão de contas, grupos e permissões no Active Directory e Google Workspace",
        "Gestão de switches e access points pelo UniFi Console",
        "Monitoramento de firewall Sophos e auditoria do AD com PingCastle e Purple Knight",
        "Scripts em PowerShell, Python e Batch para diagnóstico de rede e chamados"
      ]
    },
    {
      empresa: "UniAteneu",
      cargo: "Estagiário de TI",
      inicio: "03/2026",
      fim: "09/2026",
      atividades: [
        "Manutenção preventiva e corretiva de hardware",
        "Suporte técnico N1",
        "Inventário de ativos padronizado no GLPI",
        "Infraestrutura de laboratórios e rede LAN"
      ]
    },
    {
      empresa: "GN CAR",
      cargo: "Estagiário Administrativo e de Seguros",
      inicio: "05/2025",
      fim: "03/2026",
      atividades: [
        "Operação de sistemas corporativos e tratamento de dados sensíveis",
        "Manutenção básica de estações de trabalho"
      ]
    },
    {
      empresa: "Felipe Carneiro Motors",
      cargo: "Estagiário de Vendas e Administrativo",
      inicio: "02/2025",
      fim: "05/2025",
      atividades: [
        "Automação de processos com scripts e chatbot",
        "Gestão de inventário digital"
      ]
    }
  ],

  projetos: [
    {
      nome: "NetConfig Pro",
      resumo: "Gerador de configuração para equipamentos de rede, com validação de segurança antes de exportar.",
      status: "desenvolvimento",
      link: "",   // link público quando existir (site, demo ou repositório)
      slides: [
        {
          rotulo: "Problema",
          titulo: "Configuração feita à mão gera erro e brecha",
          texto: "Configurar roteador e firewall equipamento por equipamento abre espaço para VLAN errada, serviço inseguro esquecido ligado e senha padrão. O NetConfig Pro parte de um modelo, valida e só então gera o script.",
          lista: []
        },
        {
          rotulo: "Protótipo",
          titulo: "O que já funciona",
          texto: "Protótipo em uma página HTML com Tailwind.",
          lista: [
            "Escolha do fabricante: MikroTik RouterOS 7, VyOS ou FortiGate",
            "Mapeamento de portas e VLANs",
            "Sanity check da configuração antes de exportar",
            "Exportação do script pronto"
          ]
        },
        {
          rotulo: "Segurança",
          titulo: "Regras que o gerador segue",
          texto: "",
          lista: [
            "A senha do admin nunca vai dentro do script",
            "O usuário admin padrão nasce desabilitado",
            "Sintaxe e limites de cada fabricante vêm da documentação oficial",
            "MFA obrigatório para quem administra ou faz deploy"
          ],
          codigo: "/user disable admin\n/ip service disable telnet\n/ip service disable ftp\n/interface vlan add interface=bridge-lan name=vlan10-adm vlan-id=10",
          notaCodigo: "Exemplo ilustrativo do formato de saída (RouterOS 7)."
        },
        {
          rotulo: "Roadmap",
          titulo: "Módulos",
          texto: "",
          lista: [],
          modulos: [
            { nome: "Designer de topologia e templates", status: "prototipo" },
            { nome: "Motor de hardening com nota de 0 a 100", status: "planejado" },
            { nome: "Auditor de infraestrutura", status: "planejado" },
            { nome: "Telemetria e dashboard (Zabbix / Prometheus)", status: "planejado" },
            { nome: "Deploy por SSH e API", status: "planejado" }
          ]
        },
        {
          rotulo: "Stack",
          titulo: "Tecnologias",
          texto: "",
          lista: [],
          stack: [
            { grupo: "Protótipo", itens: ["HTML", "Tailwind CSS", "JavaScript"] },
            { grupo: "Back-end planejado", itens: ["Python", "FastAPI", "PostgreSQL", "Redis", "Celery", "JWT com RBAC"] },
            { grupo: "Laboratório", itens: ["VyOS em VM"] }
          ]
        }
      ]
    },
    {
      nome: "StockMaster",
      resumo: "Automação RPA em Python que faz login num sistema web e cadastra cerca de 290 produtos a partir de uma planilha, sem digitação manual.",
      status: "concluido",
      link: "https://github.com/ArthurCoding/StockMaster",
      slides: [
        {
          rotulo: "O que faz",
          titulo: "Cadastro em massa sem digitar",
          texto: "O script simula um usuário: abre o navegador, faz login e registra, um a um, os produtos lidos de um CSV.",
          lista: [
            "Lê a planilha com Pandas",
            "Preenche código, marca, tipo, categoria, preço, custo e observação",
            "Envia o formulário de cada produto, cerca de 290 itens"
          ]
        },
        {
          rotulo: "Segurança",
          titulo: "Senha fora do código",
          texto: "E-mail e senha do sistema são lidos de variáveis de ambiente. Nada sensível fica no repositório.",
          lista: [],
          codigo: "$env:HASHTAG_EMAIL=\"seu_email\"\n$env:HASHTAG_SENHA=\"sua_senha\"\npython codigo.py",
          notaCodigo: "Execução no PowerShell, como está no README."
        },
        {
          rotulo: "Limites",
          titulo: "O que eu sei que limita",
          texto: "Os cliques usam coordenadas de tela, então dependem da resolução. O script auxiliar mostra a posição do mouse para recalibrar.",
          lista: []
        },
        {
          rotulo: "Stack",
          titulo: "Tecnologias",
          texto: "",
          lista: [],
          stack: [
            { grupo: "Automação", itens: ["Python 3", "PyAutoGUI", "Pandas"] },
            { grupo: "Origem", itens: ["Intensivão de Python · Hashtag Programação"] }
          ]
        }
      ]
    }
  ],

  /*
    IA COMO FERRAMENTA — mostra uso com critério, não dependência.
    Revise cada frase: só deixe o que for verdade na sua rotina.
  */
  ia: {
    resumo: "Uso IA todos os dias para ganhar velocidade em pesquisa, documentação e automação. Quem define o problema, confere o resultado e decide o que vai para produção sou eu.",
    fluxo: [
      { etapa: "Defino o problema", quem: "eu", texto: "Escopo, ambiente, o que pode e o que não pode mudar." },
      { etapa: "Acelero com IA", quem: "IA", texto: "Pesquisa, comparação de documentação e primeiro rascunho de script." },
      { etapa: "Verifico", quem: "eu", texto: "Documentação oficial do fabricante e teste em laboratório antes de usar." },
      { etapa: "Aplico e respondo", quem: "eu", texto: "Só aplico o que entendo linha por linha. A responsabilidade é minha." }
    ],
    uso: [
      "Pesquisar e comparar documentação técnica",
      "Rascunhar scripts de PowerShell e Python, que reviso e testo",
      "Documentar procedimentos e organizar estudos",
      "Estudar agentes de IA aplicados à automação de TI"
    ],
    naoDelego: [
      "Mudança em produção sem revisão e teste",
      "Credenciais, senhas e dados internos de empresa",
      "Decisão de segurança: liberar acesso, abrir porta, mudar regra"
    ],
    formacao: ["Imersão Agentes de IA na Prática · Daxus", "Cybersegurança na Era da IA · EBAC"]
  },

  formacao: [
    { curso: "Engenharia de Software (bacharelado)", instituicao: "UniAteneu", periodo: "em andamento · previsão 12/2028" },
    { curso: "Técnico em Redes de Computadores · 1.200 h", instituicao: "SESI SENAI", periodo: "concluído em 2023.2" }
  ],

  // tipo: "certificado" (com avaliação) ou "curso" (participação)
  certificacoes: [
    { tipo: "certificado", nome: "Introdução à Cibersegurança", emissor: "Cisco Networking Academy" },
    { tipo: "certificado", nome: "Introdução ao Pentest na Prática", emissor: "DESEC Security" },
    { tipo: "curso", nome: "Imersão Agentes de IA na Prática", emissor: "Daxus" },
    { tipo: "curso", nome: "Cybersegurança na Era da IA", emissor: "EBAC" },
    { tipo: "curso", nome: "Hack to Learn", emissor: "Hacking Club" },
    { tipo: "curso", nome: "Programação em Python", emissor: "Fundação Bradesco" }
  ],

  /*
    MAPA DE ATUAÇÃO — cada equipamento da rede mostra as ferramentas e onde você usou.
    "onde" deve conter só experiência real.
  */
  topologia: {
    inicial: "firewall",
    nos: [
      { id: "internet", nome: "Internet", sigla: "WAN", ferramentas: [], onde: [] },
      { id: "firewall", nome: "Firewall", sigla: "FW",
        ferramentas: ["Sophos Firewall", "VPN"],
        onde: ["Monitoramento do Sophos Firewall no Sistema Jangadeiro"] },
      { id: "rede", nome: "Switches e APs", sigla: "LAN",
        ferramentas: ["UniFi Console", "VLAN", "TCP/IP", "DNS", "DHCP"],
        onde: [
          "Gestão de switches e access points pelo UniFi Console (Sistema Jangadeiro)",
          "Rede LAN dos laboratórios (UniAteneu)",
          "Técnico em Redes de Computadores, SESI SENAI (1.200 h)"
        ] },
      { id: "servidores", nome: "Servidores", sigla: "SRV",
        ferramentas: ["Windows Server", "Linux (Ubuntu)", "SSH"],
        onde: ["Suporte remoto por SSH e VNC em Windows e Linux (Sistema Jangadeiro)"] },
      { id: "identidade", nome: "Identidade", sigla: "IAM",
        ferramentas: ["Active Directory", "Group Policy", "Entra ID", "Google Workspace Admin", "PingCastle", "Purple Knight"],
        onde: [
          "Contas, grupos e permissões no AD e no Google Workspace (Sistema Jangadeiro)",
          "Auditoria do AD com PingCastle e Purple Knight (Sistema Jangadeiro)"
        ] },
      { id: "estacoes", nome: "Estações", sigla: "END",
        ferramentas: ["Sophos Central", "EDR/XDR", "Suporte N1/N2", "GLPI"],
        onde: [
          "Controle de antivírus e suporte N1/N2 (Sistema Jangadeiro)",
          "Manutenção de hardware e inventário no GLPI (UniAteneu)"
        ] },
      { id: "automacao", nome: "Automação", sigla: "AUT",
        ferramentas: ["PowerShell", "Python", "Batch", "SQL", "Git"],
        onde: [
          "Scripts para diagnóstico de rede e chamados (Sistema Jangadeiro)",
          "Automação de processos com scripts e chatbot (Felipe Carneiro Motors)"
        ] }
    ],
    // [origem, destino, tracejado]
    links: [
      ["internet", "firewall"], ["firewall", "rede"], ["rede", "servidores"], ["rede", "estacoes"],
      ["servidores", "identidade"], ["automacao", "servidores", true], ["automacao", "estacoes", true]
    ]
  },

  stack: [
    { grupo: "Redes", itens: ["TCP/IP", "DNS", "DHCP", "VPN", "VLAN", "UniFi", "Switches e APs"] },
    { grupo: "Segurança", itens: ["Sophos Firewall", "Sophos Central", "EDR/XDR", "PingCastle", "Purple Knight", "Análise de phishing"] },
    { grupo: "Identidade e acesso", itens: ["Active Directory", "Group Policy", "Entra ID", "Google Workspace Admin"] },
    { grupo: "Sistemas", itens: ["Windows Server", "Windows", "Linux (Ubuntu)", "SSH"] },
    { grupo: "Automação", itens: ["PowerShell", "Python", "Batch", "SQL", "Git"] },
    { grupo: "Suporte", itens: ["N1/N2", "Service Desk", "GLPI", "Suporte remoto"] }
  ]
};
