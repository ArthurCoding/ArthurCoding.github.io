(function () {
  "use strict";
  var D = window.PORTFOLIO;
  if (!D) return;
  var reduzMovimento = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ================= utilitários ================= */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        var v = attrs[k];
        if (v === null || v === undefined || v === false) return;
        if (k === "class") el.className = v;
        else if (k === "text") el.textContent = v;
        else el.setAttribute(k, v === true ? "" : v);
      });
    }
    for (var i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  function $(id) { return document.getElementById(id); }
  function chips(itens) { return itens.map(function (i) { return h("span", { class: "chip", text: i }); }); }
  // reinicia uma animação CSS de entrada
  function animar(el, classe) {
    if (reduzMovimento || !el) return;
    el.classList.remove(classe);
    void el.offsetWidth;
    el.classList.add(classe);
  }

  /* ================= tema claro/escuro ================= */
  (function () {
    var btn = $("theme-btn"), root = document.documentElement;
    try { var salvo = localStorage.getItem("tema"); if (salvo === "light" || salvo === "dark") root.setAttribute("data-theme", salvo); } catch (e) {}
    function atual() {
      var t = root.getAttribute("data-theme");
      if (t === "light" || t === "dark") return t;
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
    function rotular() { btn.setAttribute("aria-label", atual() === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"); }
    btn.addEventListener("click", function () {
      var novo = atual() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", novo);
      try { localStorage.setItem("tema", novo); } catch (e) {}
      rotular();
    });
    rotular();
  })();

  /* ================= status: barras em vez de cor ================= */
  var STATUS = {
    concluido: { label: "Concluído", nivel: 3 },
    desenvolvimento: { label: "Em desenvolvimento", nivel: 2 },
    prototipo: { label: "Protótipo", nivel: 2 },
    planejado: { label: "Planejado", nivel: 0 }
  };
  function status(chave) {
    var s = STATUS[chave] || { label: chave, nivel: 0 };
    var meter = h("span", { class: "meter", "aria-hidden": "true" });
    for (var i = 1; i <= 3; i++) meter.append(h("i", { class: i <= s.nivel ? "on" : "" }));
    return h("span", { class: "status" }, meter, s.label);
  }

  /* ================= carrossel (sem bibliotecas) =================
     opts.cards   -> vários cartões por vez
     opts.rotulos -> abas clicáveis acima, sincronizadas com o slide */
  function carrossel(slides, opts) {
    opts = opts || {};
    var n = slides.length;
    var root = h("div", {
      class: "carousel" + (opts.cards ? " cards" : ""),
      role: "region", "aria-roledescription": "carrossel", "aria-label": opts.label || "Carrossel"
    });
    var track = h("div", { class: "track", tabindex: "0" });
    var els = slides.map(function (conteudo, i) {
      var s = h("div", { class: "slide", role: "group", "aria-roledescription": "slide", "aria-label": (i + 1) + " de " + n }, conteudo);
      track.append(s);
      return s;
    });

    var abas = null, abaEls = [];
    if (opts.rotulos) {
      abas = h("div", { class: "car-abas", role: "tablist", "aria-label": "Partes" });
      abaEls = opts.rotulos.map(function (r, i) {
        var b = h("button", { class: "car-aba", type: "button", role: "tab", text: r });
        b.addEventListener("click", function () { ir(i); });
        abas.append(b);
        return b;
      });
      root.append(abas);
    }

    var barra = h("div", { class: "car-progresso", "aria-hidden": "true" }, h("span"));
    var prev = h("button", { class: "btn-nav", type: "button", "aria-label": "Anterior", text: "←" });
    var next = h("button", { class: "btn-nav", type: "button", "aria-label": "Próximo", text: "→" });
    var counter = h("span", { class: "counter", "aria-live": "polite" });
    var dots = h("div", { class: "dots" });
    var dotEls = opts.rotulos ? [] : els.map(function (_, i) {
      var d = h("button", { class: "dot", type: "button", "aria-label": "Ir para o item " + (i + 1) });
      d.addEventListener("click", function () { ir(i); });
      dots.append(d);
      return d;
    });
    var controls = h("div", { class: "controls" }, prev, counter, next, dots);
    root.append(track, barra, controls);

    var atual = 0, primeiro = true, animado = 0, parada = 0;
    function ir(i) {
      i = Math.max(0, Math.min(n - 1, i));
      track.scrollTo({ left: els[i].offsetLeft - els[0].offsetLeft, behavior: reduzMovimento ? "auto" : "smooth" });
    }
    function noFim() { return track.scrollLeft + track.clientWidth >= track.scrollWidth - 2; }
    function atualizar() {
      var x = track.scrollLeft, melhor = 0, dist = Infinity;
      els.forEach(function (s, i) {
        var d = Math.abs(s.offsetLeft - els[0].offsetLeft - x);
        if (d < dist) { dist = d; melhor = i; }
      });
      if (noFim() && !opts.cards) melhor = n - 1;
      var mudou = melhor !== atual;
      atual = melhor;
      var visiveis = Math.max(1, Math.round(track.clientWidth / (els[0].offsetWidth || 1)));
      var ultimo = noFim() ? n - 1 : Math.min(n - 1, atual + visiveis - 1);
      var tudoCabe = track.scrollWidth <= track.clientWidth + 2;
      controls.hidden = tudoCabe;
      barra.hidden = tudoCabe;
      prev.disabled = x <= 2;
      next.disabled = noFim();
      counter.textContent = visiveis > 1 && ultimo > atual ? (atual + 1) + "–" + (ultimo + 1) + " / " + n : (atual + 1) + " / " + n;
      barra.firstChild.style.width = ((ultimo + 1) / n * 100) + "%";
      dotEls.forEach(function (d, i) { d.setAttribute("aria-current", i >= atual && i <= ultimo ? "true" : "false"); });
      abaEls.forEach(function (b, i) {
        b.setAttribute("aria-selected", i === atual ? "true" : "false");
        b.tabIndex = i === atual ? 0 : -1;
      });
      // anima o conteúdo só quando o carrossel para de deslizar
      if (!primeiro && !opts.cards) {
        clearTimeout(parada);
        parada = setTimeout(function () {
          if (atual !== animado) { animado = atual; animar(els[atual], "entra"); }
        }, 140);
      }
      if (mudou && abaEls[atual] && abas) {
        var a = abaEls[atual];
        abas.scrollTo({ left: a.offsetLeft - abas.clientWidth / 2 + a.offsetWidth / 2, behavior: reduzMovimento ? "auto" : "smooth" });
      }
      primeiro = false;
    }
    var raf = 0;
    track.addEventListener("scroll", function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = 0; atualizar(); });
    }, { passive: true });
    prev.addEventListener("click", function () { ir(atual - 1); });
    next.addEventListener("click", function () { ir(noFim() ? n - 1 : atual + 1); });
    function teclas(e) {
      if (e.key === "ArrowRight") { e.preventDefault(); ir(atual + 1); if (e.currentTarget === abas) abaEls[Math.min(n - 1, atual + 1)].focus(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); ir(atual - 1); if (e.currentTarget === abas) abaEls[Math.max(0, atual - 1)].focus(); }
      else if (e.key === "Home") { e.preventDefault(); ir(0); }
      else if (e.key === "End") { e.preventDefault(); ir(n - 1); }
    }
    track.addEventListener("keydown", teclas);
    if (abas) abas.addEventListener("keydown", teclas);

    // arrastar com o mouse (no toque o navegador já arrasta sozinho)
    var drag = null;
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, idx: atual, moveu: false };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moveu && Math.abs(dx) > 5) { drag.moveu = true; track.classList.add("arrastando"); }
      if (drag.moveu) track.scrollLeft = drag.left - dx;
    });
    window.addEventListener("pointerup", function (e) {
      if (!drag) return;
      var d = drag, dx = e.clientX - d.x;
      drag = null;
      if (!d.moveu) return;
      track.classList.remove("arrastando");
      var passo = opts.cards ? Math.max(1, Math.round(Math.abs(dx) / (els[0].offsetWidth || 1))) : 1;
      ir(dx < -40 ? d.idx + passo : dx > 40 ? d.idx - passo : d.idx);
      // evita que soltar o mouse depois de arrastar conte como clique num link
      function bloquear(ev) { ev.preventDefault(); ev.stopPropagation(); }
      track.addEventListener("click", bloquear, true);
      setTimeout(function () { track.removeEventListener("click", bloquear, true); }, 0);
    });
    track.addEventListener("dragstart", function (e) { e.preventDefault(); });

    window.addEventListener("resize", atualizar);
    requestAnimationFrame(atualizar);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(atualizar);
    return root;
  }

  /* ================= hero ================= */
  var p = D.perfil;
  $("hero-nome").textContent = p.nome;
  $("hero-local").textContent = p.cidade;
  p.headline.forEach(function (t, i) {
    $("hero-headline").append(h("li", { class: "anim", style: "--i:" + (i + 2), text: t }));
  });
  var emAndamento = (D.projetos || []).filter(function (x) { return x.status !== "concluido"; })[0];
  if (emAndamento) {
    $("hero-agora").append(
      h("span", { class: "k", text: "Construindo" }),
      h("a", { href: "#projetos", text: emAndamento.nome }),
      status(emAndamento.status)
    );
  } else {
    $("hero-agora").hidden = true;
  }

  /* ================= sobre e formação ================= */
  p.sobre.forEach(function (t) { $("sobre-texto").append(h("p", { text: t })); });
  (D.formacao || []).forEach(function (f) {
    $("formacao").append(h("div", { class: "row" },
      h("div", null, h("div", { class: "curso", text: f.curso }), h("div", { class: "inst", text: f.instituicao })),
      h("div", { class: "periodo", text: f.periodo })
    ));
  });

  /* ================= mapa de atuação (topologia) ================= */
  (function () {
    var T = D.topologia;
    if (!T) return;
    // posições em % — "largo" no computador, "alto" no celular
    var LAYOUT = {
      largo: { internet: [6, 50], firewall: [24, 50], rede: [44, 50], servidores: [66, 24], estacoes: [66, 76], identidade: [88, 24], automacao: [88, 76] },
      alto: { internet: [50, 6], firewall: [50, 21], rede: [50, 37], servidores: [26, 57], estacoes: [74, 57], identidade: [26, 82], automacao: [74, 82] }
    };
    var SVG = "http://www.w3.org/2000/svg";
    var mapa = h("div", { class: "topo" });
    var svg = document.createElementNS(SVG, "svg");
    svg.setAttribute("class", "topo-linhas");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("aria-hidden", "true");
    mapa.append(svg);

    var linhas = T.links.map(function (l) {
      var base = document.createElementNS(SVG, "line");
      base.setAttribute("class", "lk" + (l[2] ? " tracejado" : ""));
      svg.append(base);
      var fluxo = null;
      if (!l[2]) {
        fluxo = document.createElementNS(SVG, "line");
        fluxo.setAttribute("class", "fluxo");
        svg.append(fluxo);
      }
      return { de: l[0], para: l[1], base: base, fluxo: fluxo };
    });

    var porId = {};
    var botoes = T.nos.map(function (no) {
      porId[no.id] = no;
      var ativo = no.ferramentas.length > 0;
      var el = h(ativo ? "button" : "div", {
        class: "no" + (ativo ? "" : " no-passivo"), type: ativo ? "button" : null,
        "aria-pressed": ativo ? "false" : null, "data-id": no.id
      }, h("span", { class: "no-sigla", text: no.sigla }), h("span", { class: "no-nome", text: no.nome }));
      if (ativo) el.addEventListener("click", function () { selecionar(no.id, true); });
      mapa.append(el);
      return el;
    });

    var painel = h("div", { class: "topo-painel", "aria-live": "polite" });
    var listaBtn = h("button", { class: "btn btn-sm", type: "button", "aria-expanded": "false", text: "Ver tudo em lista" });
    var lista = h("dl", { class: "stack", hidden: true }, D.stack.map(function (g) {
      return h("div", null, h("dt", { text: g.grupo }), h("dd", null, chips(g.itens)));
    }));
    listaBtn.addEventListener("click", function () {
      lista.hidden = !lista.hidden;
      listaBtn.setAttribute("aria-expanded", String(!lista.hidden));
      listaBtn.textContent = lista.hidden ? "Ver tudo em lista" : "Esconder lista";
    });

    $("topo-wrap").append(mapa, painel, h("div", { class: "topo-rodape" }, listaBtn), lista);

    function posicionar() {
      var modo = mapa.clientWidth < 620 ? "alto" : "largo";
      mapa.classList.toggle("alto", modo === "alto");
      var L = LAYOUT[modo];
      botoes.forEach(function (b) {
        var pos = L[b.getAttribute("data-id")];
        b.style.left = pos[0] + "%";
        b.style.top = pos[1] + "%";
      });
      linhas.forEach(function (l) {
        var a = L[l.de], z = L[l.para];
        [l.base, l.fluxo].forEach(function (ln) {
          if (!ln) return;
          ln.setAttribute("x1", a[0]); ln.setAttribute("y1", a[1]);
          ln.setAttribute("x2", z[0]); ln.setAttribute("y2", z[1]);
        });
      });
    }

    function selecionar(id, peloUsuario) {
      var no = porId[id];
      botoes.forEach(function (b) {
        if (b.tagName === "BUTTON") b.setAttribute("aria-pressed", b.getAttribute("data-id") === id ? "true" : "false");
      });
      linhas.forEach(function (l) {
        var on = l.de === id || l.para === id;
        l.base.classList.toggle("on", on);
      });
      painel.replaceChildren(
        h("div", { class: "topo-titulo" }, h("span", { class: "no-sigla", text: no.sigla }), h("h3", { text: no.nome })),
        h("div", { class: "topo-cols" },
          h("div", null, h("p", { class: "mini", text: "Ferramentas" }), h("div", { class: "chips" }, chips(no.ferramentas))),
          h("div", null, h("p", { class: "mini", text: "Onde usei" }),
            h("ul", { class: "onde" }, no.onde.map(function (o) { return h("li", { text: o }); })))
        )
      );
      if (peloUsuario) animar(painel, "entra");
    }

    posicionar();
    selecionar(T.inicial || T.nos[1].id, false);
    if (window.ResizeObserver) new ResizeObserver(posicionar).observe(mapa);
    else window.addEventListener("resize", posicionar);
  })();

  /* ================= experiência em abas ================= */
  (function () {
    var tabs = h("div", { class: "exp-abas", role: "tablist", "aria-label": "Empresas" });
    var painel = h("div", { class: "exp-painel", role: "tabpanel", id: "exp-painel", tabindex: "0" });
    var btns = D.experiencias.map(function (e, i) {
      var atual = /atual/i.test(e.fim);
      var b = h("button", { class: "exp-aba", type: "button", role: "tab", id: "exp-aba-" + i, "aria-controls": "exp-painel" },
        h("span", { class: "exp-aba-nome", text: e.empresa }),
        h("span", { class: "exp-aba-datas" + (atual ? " atual" : "") }, e.inicio + " – " + (atual ? "atual" : e.fim))
      );
      b.addEventListener("click", function () { mostrar(i, true); });
      tabs.append(b);
      return b;
    });
    tabs.addEventListener("keydown", function (ev) {
      var i = btns.indexOf(document.activeElement);
      if (i < 0) return;
      var alvo = null;
      if (ev.key === "ArrowDown" || ev.key === "ArrowRight") alvo = (i + 1) % btns.length;
      else if (ev.key === "ArrowUp" || ev.key === "ArrowLeft") alvo = (i - 1 + btns.length) % btns.length;
      else if (ev.key === "Home") alvo = 0;
      else if (ev.key === "End") alvo = btns.length - 1;
      if (alvo === null) return;
      ev.preventDefault();
      btns[alvo].focus();
      mostrar(alvo, true);
    });
    function mostrar(i, peloUsuario) {
      var e = D.experiencias[i];
      btns.forEach(function (b, j) {
        b.setAttribute("aria-selected", j === i ? "true" : "false");
        b.tabIndex = j === i ? 0 : -1;
      });
      painel.setAttribute("aria-labelledby", "exp-aba-" + i);
      painel.replaceChildren(
        h("p", { class: "mini", text: e.inicio + " – " + e.fim }),
        h("h3", { class: "exp-empresa", text: e.empresa }),
        h("p", { class: "exp-cargo", text: e.cargo }),
        h("ul", { class: "exp-ativ" }, e.atividades.map(function (a, k) {
          return h("li", { style: "--i:" + k, text: a });
        }))
      );
      if (peloUsuario) {
        animar(painel, "entra");
        if (tabs.scrollWidth > tabs.clientWidth) {
          tabs.scrollTo({ left: btns[i].offsetLeft - 16, behavior: reduzMovimento ? "auto" : "smooth" });
        }
      }
    }
    $("exp").append(h("div", { class: "exp" }, tabs, painel));
    mostrar(0, false);
  })();

  /* ================= projetos ================= */
  function slideCase(s) {
    var partes = [h("p", { class: "case-rotulo", text: s.rotulo }), h("h4", { text: s.titulo })];
    if (s.texto) partes.push(h("p", { text: s.texto }));
    if (s.lista && s.lista.length) partes.push(h("ul", null, s.lista.map(function (x) { return h("li", { text: x }); })));
    if (s.codigo) {
      partes.push(h("figure", { class: "code" },
        h("pre", null, h("code", { text: s.codigo })),
        s.notaCodigo ? h("figcaption", { text: s.notaCodigo }) : null));
    }
    if (s.modulos) {
      partes.push(h("ul", { class: "modulos" }, s.modulos.map(function (m) {
        return h("li", null, h("span", { text: m.nome }), status(m.status));
      })));
    }
    if (s.stack) {
      partes.push(h("dl", null, s.stack.map(function (g) {
        return h("div", null, h("dt", { text: g.grupo }), h("dd", null, chips(g.itens)));
      })));
    }
    return h("article", { class: "case" }, partes);
  }
  D.projetos.forEach(function (pr) {
    var head = h("div", { class: "projeto-head" }, h("h3", { text: pr.nome }), status(pr.status));
    if (pr.link) head.append(h("a", { class: "projeto-link", href: pr.link, target: "_blank", rel: "noopener", text: "Abrir ↗" }));
    $("lista-projetos").append(h("article", { class: "projeto" },
      head,
      h("p", { class: "projeto-resumo", text: pr.resumo }),
      carrossel(pr.slides.map(slideCase), {
        label: "Detalhes do projeto " + pr.nome,
        rotulos: pr.slides.map(function (s) { return s.rotulo; })
      })
    ));
  });

  /* ================= IA como ferramenta ================= */
  (function () {
    var A = D.ia;
    if (!A) { $("ia").hidden = true; return; }
    var fluxo = h("ol", { class: "ia-fluxo", "aria-label": "Como uso IA, passo a passo" },
      A.fluxo.map(function (f, i) {
        var minha = f.quem !== "IA";
        return h("li", { class: "ia-passo" + (minha ? " meu" : " ia"), style: "--i:" + i },
          h("span", { class: "ia-quem", text: minha ? "eu" : "IA" }),
          h("strong", { class: "ia-etapa", text: f.etapa }),
          h("span", { class: "ia-txt", text: f.texto }));
      }));
    function coluna(titulo, itens, marca) {
      return h("div", { class: "ia-col" }, h("p", { class: "mini", text: titulo }),
        h("ul", { class: "ia-lista " + marca }, itens.map(function (t) { return h("li", { text: t }); })));
    }
    $("ia-body").append(
      h("p", { class: "ia-resumo", text: A.resumo }),
      fluxo,
      h("div", { class: "ia-cols" },
        coluna("Onde uso", A.uso, "mais"),
        coluna("O que não entrego à IA", A.naoDelego, "menos")),
      A.formacao && A.formacao.length ? h("p", { class: "ia-form" }, h("span", { class: "mini", text: "Formação em IA" }), " ", A.formacao.join("  ·  ")) : null
    );
  })();

  /* ================= certificações com filtro ================= */
  (function () {
    var FILTROS = [
      { id: "todos", nome: "Todos", teste: function () { return true; } },
      { id: "certificado", nome: "Certificados", teste: function (c) { return c.tipo === "certificado"; } },
      { id: "curso", nome: "Cursos", teste: function (c) { return c.tipo !== "certificado"; } }
    ];
    var area = h("div", { class: "cert-area" });
    var seg = h("div", { class: "seg", role: "group", "aria-label": "Filtrar" });
    var segBtns = FILTROS.map(function (f) {
      var qtd = D.certificacoes.filter(f.teste).length;
      var b = h("button", { class: "seg-btn", type: "button", "aria-pressed": "false" }, f.nome, h("span", { class: "seg-n", text: String(qtd) }));
      b.addEventListener("click", function () { filtrar(f, true); });
      seg.append(b);
      return b;
    });
    function cartao(c) {
      var cheio = c.tipo === "certificado";
      return h("article", { class: "cert" },
        h("p", { class: "cert-tipo" }, h("span", { class: "sel" + (cheio ? " cheio" : ""), "aria-hidden": "true" }), cheio ? "Certificado" : "Curso"),
        h("h4", { text: c.nome }),
        h("p", { class: "cert-emissor", text: c.emissor }));
    }
    function filtrar(f, peloUsuario) {
      segBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", FILTROS[i] === f ? "true" : "false"); });
      area.replaceChildren(carrossel(D.certificacoes.filter(f.teste).map(cartao), { cards: true, label: "Certificações e cursos: " + f.nome }));
      if (peloUsuario) animar(area, "entra");
    }
    $("certs").append(seg, area, h("p", { class: "cert-legenda" },
      h("span", null, h("span", { class: "sel cheio", "aria-hidden": "true" }), "Certificado: concluído com avaliação"),
      h("span", null, h("span", { class: "sel", "aria-hidden": "true" }), "Curso: participação")));
    filtrar(FILTROS[0], false);
  })();

  /* ================= contato ================= */
  var c = D.contato;
  var listaC = h("div", { class: "contato" });
  if (c.email) {
    var emailEl = h("span", { class: "v", text: c.email });
    var copiar = h("button", { class: "btn", type: "button", text: "Copiar" });
    copiar.addEventListener("click", function () {
      function ok() { copiar.textContent = "Copiado"; setTimeout(function () { copiar.textContent = "Copiar"; }, 1800); }
      function selecionar() {
        var r = document.createRange(); r.selectNodeContents(emailEl);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        copiar.textContent = "Selecionado: use Ctrl+C";
      }
      try { navigator.clipboard.writeText(c.email).then(ok, selecionar); } catch (e) { selecionar(); }
    });
    listaC.append(h("div", { class: "row" }, h("span", { class: "k", text: "E-mail" }), emailEl, copiar));
  }
  [["LinkedIn", c.linkedin], ["GitHub", c.github]].forEach(function (par) {
    if (!par[1]) return;
    listaC.append(h("div", { class: "row" },
      h("span", { class: "k", text: par[0] }),
      h("span", { class: "v", text: par[1].replace(/^https?:\/\/(www\.)?/, "") }),
      h("a", { class: "btn", href: par[1], target: "_blank", rel: "noopener", text: "Abrir ↗" })));
  });
  $("contato-body").append(listaC);
  if (c.curriculoPdf) {
    $("contato-body").append(h("div", { class: "contato-cta" },
      h("a", { class: "btn primary", href: c.curriculoPdf, target: "_blank", rel: "noopener", text: "Abrir currículo (PDF)" })));
  }

  /* ================= rodapé ================= */
  $("rodape").append(h("span", { text: p.nomeCompleto + " · " + p.cidade }), h("span", { text: "Atualizado em " + D.atualizado }));
})();
