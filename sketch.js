// ================================================================
// PROJETO AGRINHO 2026 - CONEXÕES QUE TRANSFORMAM (VERSÃO FINAL COMPLETA)
// DESENVOLVEDORA: ANA JULIA DUARTE CALIXTO
// ORIENTAÇÃO: PROFESSORA GREISY
// INSTITUIÇÃO: COLÉGIO ESTADUAL JORGE SCHIMMELPFENG
// =================================================================

let estadoJogo = 0; // 0: Inicio, 1: Jogando, 2: Fim
let pontuacao = 0;
let recorde = 0; // Guarda a maior pontuação da sessão
let vidas = 3;
let somAtivado = true; // Controla se o som vai tocar ou não

// Jogador (VUC Elétrico) - lJ e hJ aumentados para o caminhão ficar maior e caber o texto
let xJ = 100, yJ, velY = 0, grav = 0.6;
let lJ = 135, hJ = 60, chaoY;
let pulando = false;

// Sistema de Power-Up (Modo Super Solar)
let superSolar = false;
let tempoSuper = 0;

// Itens e Obstáculos
let objetos = [];
let proximoObjeto = 0;

// Variáveis para os Prédios e Elementos Visuais Variados
let dadosPredios = [];
let dadosElementosAgricolas = []; // Elementos do cenário de fundo (vacas, tratores, árvores)

// Sistema de Trilha Sonora - Notas musicais completas restauradas
let proximaNotaMusica = 0;
let indiceNota = 0;
let melodia = [261, 293, 329, 349, 392, 349, 329, 293, 329, 329, 392, 440, 392, 349, 329, 261];

function setup() {
  createCanvas(800, 450);
  chaoY = height - 70;
  yJ = chaoY - hJ;
  
  // Gerar prédios variados para a transição urbana
  for (let i = 0; i < 8; i++) {
    dadosPredios.push({
      largura: random(80, 140),
      altura: random(180, 260),
      deslocamentoX: i * 160
    });
  }

  // Gerar elementos agrícolas de fundo para o início (campo)
  for (let i = 0; i < 10; i++) {
    dadosElementosAgricolas.push({
      x: random(50, 2000),
      tipo: random(["VACA", "OVELHA", "TRATOR_FUNDO", "ARVORE"]),
      tamanho: random(20, 35)
    });
  }
}

function draw() {
  if (estadoJogo === 0) telaInicio();
  if (estadoJogo === 1) {
    jogar();
    if (somAtivado) tocarMusicaFundo(); // Só toca se não estiver mutado
  }
  if (estadoJogo === 2) telaFim();
}

function jogar() {
  // 1. CICLO DINÂMICO DE CENÁRIO (Campo -> Pôr do Sol -> Cidade à Noite)
  let transicao = constrain(pontuacao / 250, 0, 1);
  let corCeu;
  
  if (transicao < 0.5) {
    corCeu = lerpColor(color(135, 206, 235), color(230, 126, 34), transicao * 2);
  } else {
    corCeu = lerpColor(color(230, 126, 34), color(24, 28, 43), (transicao - 0.5) * 2);
  }
  background(corCeu);

  // Desenha Montanhas do Campo com a opacidade corrigida externa
  let opacidadeMontanha = 255 * (1 - transicao);
  fill(46, 117, 89, opacidadeMontanha);
  triangle(-50, chaoY, 150, 150, 350, chaoY);
  triangle(200, chaoY, 450, 100, 700, chaoY);

  // DESENHA ELEMENTOS AGRÍCOLAS NO FUNDO (Cultura e Tecnologia no Campo)
  if (transicao < 0.8) {
    for (let i = 0; i < dadosElementosAgricolas.length; i++) {
      let el = dadosElementosAgricolas[i];
      let elX = ((el.x - frameCount * 0.8) % 1600) + 100;
      
      if (elX < width + 50 && elX > -50) {
        push();
        let opacidadeFundo = 255 * (1 - transicao);
        textSize(el.tamanho);
        textAlign(CENTER, BOTTOM);
        
        if (el.tipo === "VACA") {
          fill(255, opacidadeFundo);
          text("🐄", elX, chaoY);
        } else if (el.tipo === "OVELHA") {
          fill(255, opacidadeFundo);
          text("🐑", elX, chaoY);
        } else if (el.tipo === "TRATOR_FUNDO") {
          fill(255, opacidadeFundo);
          text("🚜", elX, chaoY);
        } else if (el.tipo === "ARVORE") {
          fill(255, opacidadeFundo);
          text("🌳", elX, chaoY);
        }
        pop();
      }
    }
  }

  // Desenha Prédios Variados (Cidade Inteligente)
  if (transicao > 0.2) {
    for (let i = 0; i < dadosPredios.length; i++) {
      let p = dadosPredios[i];
      let predioX = ((p.deslocamentoX - frameCount * 0.5) % 1280) + 200;
      
      if (predioX < width + 150 && predioX > -150) {
        fill(55, 59, 74, 255 * transicao);
        rect(predioX, chaoY - p.altura, p.largura, p.altura);
        
        if (transicao > 0.7) {
          fill(i % 2 === 0 ? color(241, 196, 15) : color(52, 152, 219));
          rect(predioX + p.largura/4, chaoY - p.altura + 30, 12, 12);
          rect(predioX + p.largura/2 + 10, chaoY - p.altura + 70, 12, 12);
          rect(predioX + p.largura/4, chaoY - p.altura + 110, 12, 12);
        }
      }
    }
  }

  // Estrada
  fill(40);
  rect(0, chaoY, width, 70
